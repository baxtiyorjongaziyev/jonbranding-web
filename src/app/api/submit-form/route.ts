import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { submitFormSchema } from '@/lib/validation/submit-form';
import { guardLeadRequest } from '@/lib/lead-guard';
import { logger } from '@/lib/logger';
import { runAnalyticsDeliveries } from '@/lib/analytics-delivery';
import { runLeadDeliveries } from '@/lib/lead-contact';
import {
  type CleanLeadData,
  type LeadData,
  type AmoCrmLeadResult,
} from '@/lib/services/lead-types';
import {
  sendTelegramIfConfigured,
  buildTelegramMessage,
  escapeTelegramHtml,
} from '@/lib/services/telegram-service';
import { sendToAmoCrm } from '@/lib/services/amocrm-service';
import {
  queueFailedAmoCrmLead,
  describeAmoCrmError,
} from '@/lib/services/lead-queue-service';
import { attributeAffiliateReferral } from '@/lib/services/affiliate-attribution';

// Re-export types for backward compatibility with existing tests and modules
export type { CleanLeadData, LeadData, AmoCrmLeadResult };

function cleanSecret(value: string | undefined): string {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!(await rateLimit(`submit-form:${ip}`, 5, 60_000))) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
    const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);

    const body = await request.json();

    const guard = await guardLeadRequest(request, body, ip, 'submit-form');
    if (guard.action === 'drop') {
      return NextResponse.json({
        ok: true,
        eventId: `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        integrations: {
          telegram: true,
          amoCrm: true,
          amoCrmQueued: false,
          analytics: false,
          analyticsDelivery: null,
        },
      });
    }
    if (guard.action === 'reject') {
      return NextResponse.json(
        { ok: false, error: 'Verification failed. Please reload the page and try again.' },
        { status: 400 }
      );
    }

    const validatedData = submitFormSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input data', details: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { companyWebsite: _honeypot, turnstileToken: _turnstile, ...cleanData } =
      validatedData.data;

    const cookieHeader = request.headers.get('cookie') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const fbpMatch = cookieHeader.match(/(?:^|;\s*)_fbp=([^;]*)/);
    const fbcMatch = cookieHeader.match(/(?:^|;\s*)_fbc=([^;]*)/);
    const fbp = cleanData.fbp || (fbpMatch ? decodeURIComponent(fbpMatch[1]) : undefined);
    const fbc = cleanData.fbc || (fbcMatch ? decodeURIComponent(fbcMatch[1]) : undefined);

    const leadData: LeadData = {
      ...cleanData,
      eventId: cleanData.eventId || `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      clientIp: ip,
      userAgent,
      fbp,
      fbc,
    };

    const { fullName, phone } = leadData;
    const threadId = cleanSecret(process.env.TELEGRAM_MESSAGE_THREAD_ID);

    const telegramPayload: Record<string, unknown> = {
      chat_id: chatId,
      text: buildTelegramMessage(leadData),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(threadId ? { message_thread_id: Number(threadId) } : {}),
    };

    const [telegramSuccess, amoCrmResult]: [boolean, AmoCrmLeadResult] = await runLeadDeliveries(
      () => sendTelegramIfConfigured(
        botToken,
        chatId,
        telegramPayload,
        'lead alert',
      ),
      () => sendToAmoCrm(leadData).catch(async (error: unknown) => {
        console.error('AmoCRM lead error:', error);
        const queued = await queueFailedAmoCrmLead(leadData, error);
        const reason = describeAmoCrmError(error);

        await sendTelegramIfConfigured(
          botToken,
          chatId,
          {
            ...telegramPayload,
            text: [
              '<b>AmoCRMga lead tushmadi</b>',
              '',
              `Sabab: ${escapeTelegramHtml(reason)}`,
              `Backup: ${queued ? 'Firestore queue saqlandi' : 'Firestore queue xato'}`,
              `Mijoz: ${escapeTelegramHtml(fullName)}`,
              ...(phone ? [`Telefon: ${escapeTelegramHtml(phone)}`] : []),
            ].join('\n'),
          },
          'AmoCRM failure alert',
        );

        return { ok: false, queued, error: error instanceof Error ? error.message : String(error) };
      }),
    );

    const analyticsDelivery = await runAnalyticsDeliveries(leadData);
    for (const [channel, delivery] of Object.entries(analyticsDelivery.channels)) {
      if (delivery.state === 'failed') {
        logger.error('Analytics delivery failed', {
          channel,
          eventId: leadData.eventId,
          statusCode: delivery.statusCode,
          reason: delivery.reason,
          durationMs: delivery.durationMs,
        });
      }
    }

    await attributeAffiliateReferral(leadData, amoCrmResult);

    return NextResponse.json({
      ok: true,
      eventId: leadData.eventId,
      integrations: {
        telegram: telegramSuccess,
        amoCrm: amoCrmResult.ok === true,
        amoCrmQueued: amoCrmResult.queued === true,
        analytics: analyticsDelivery.ok,
        analyticsDelivery,
      },
    });
  } catch (error: unknown) {
    console.error('Submit form error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
