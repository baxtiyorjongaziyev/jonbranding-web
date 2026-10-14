import { NextResponse } from 'next/server';
import { safeCompare } from '@/lib/security';
import { logger } from '@/lib/logger';
import {
  listUndeliveredLeads,
  markLeadDelivery,
  MAX_LEAD_ATTEMPTS,
} from '@/lib/services/lead-inbox';
import {
  buildTelegramMessage,
  sendTelegramIfConfigured,
} from '@/lib/services/telegram-service';
import { sendToAmoCrm } from '@/lib/services/amocrm-service';

export const dynamic = 'force-dynamic';

function cleanSecret(value: string | undefined): string {
  return String(value || '').replace(/^﻿/, '').trim();
}

function isAuthorized(request: Request) {
  const secret = cleanSecret(process.env.CRON_SECRET);
  const authorization = request.headers.get('authorization') || '';
  return Boolean(secret && authorization.startsWith('Bearer '))
    && safeCompare(authorization.slice(7), secret);
}

/** leads_inbox'dagi yetkazilmagan arizalarni Telegram/AmoCRM'ga qayta yuboradi. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);
  const threadId = cleanSecret(process.env.TELEGRAM_MESSAGE_THREAD_ID);

  const rows = await listUndeliveredLeads();
  const results: Array<{ eventId: string; delivered: boolean; attempts: number }> = [];

  for (const row of rows) {
    const attempts = row.attempts + 1;
    let telegram = row.telegram_ok;
    let amoCrm = row.amocrm_ok;
    let lastError: string | undefined;

    if (!telegram) {
      telegram = await sendTelegramIfConfigured(
        botToken,
        chatId,
        {
          chat_id: chatId,
          text: `<b>Qayta yuborildi (urinish ${attempts})</b>\n\n${buildTelegramMessage(row.payload)}`,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...(threadId ? { message_thread_id: Number(threadId) } : {}),
        },
        'lead retry',
      );
    }

    if (!amoCrm) {
      try {
        const result = await sendToAmoCrm(row.payload);
        amoCrm = result.ok === true;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    await markLeadDelivery(row.event_id, { telegram, amoCrm, error: lastError }, attempts);
    const delivered = telegram || amoCrm;
    if (!delivered && attempts >= MAX_LEAD_ATTEMPTS) {
      logger.error('Lead moved to dead letter', { eventId: row.event_id });
    }
    results.push({ eventId: row.event_id, delivered, attempts });
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
