import { logger } from '@/lib/logger';
import { type LeadData } from './lead-types';

export function escapeTelegramHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanSecret(value: string | undefined): string {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
}

export function hasTelegramConfig(botToken: string, chatId: string): boolean {
  return Boolean(botToken && chatId);
}

export async function sendTelegramMessage(botToken: string, payload: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result: any = await response.json().catch(() => null);

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.description || `Telegram HTTP ${response.status}`);
  }

  return result;
}

export async function sendTelegramIfConfigured(
  botToken: string,
  chatId: string,
  payload: Record<string, unknown>,
  context: string
): Promise<boolean> {
  if (process.env.MOCK_TELEGRAM === 'true') {
    logger.info(`[HARNESS-MOCK] Telegram ${context} simulated`, { chatId });
    return true;
  }

  if (!hasTelegramConfig(botToken, chatId)) {
    logger.error(`Telegram skipped for ${context}: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID`);
    return false;
  }

  try {
    await sendTelegramMessage(botToken, payload);
    return true;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    logger.error(`Telegram ${context} failed`, { chatId, reason });

    const adminChatId = cleanSecret(process.env.TELEGRAM_ADMIN_CHAT_ID);
    if (adminChatId && adminChatId !== chatId) {
      try {
        await sendTelegramMessage(botToken, {
          ...payload,
          chat_id: adminChatId,
          message_thread_id: undefined,
          text: `<b>Asosiy guruhga yuborilmadi</b>\nSabab: ${escapeTelegramHtml(reason)}\n\n${payload.text}`,
        });
        logger.warn(`Telegram ${context} delivered to fallback chat`, { adminChatId });
      } catch (fallbackError) {
        logger.error(`Telegram ${context} fallback failed`, {
          adminChatId,
          reason: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });
      }
    }

    return false;
  }
}

export function buildTelegramMessage(data: LeadData): string {
  const fullName = escapeTelegramHtml(data.fullName);
  const phone = data.phone ? escapeTelegramHtml(data.phone) : null;
  const telegram = data.telegram
    ? `@${escapeTelegramHtml(String(data.telegram).replace('@', ''))}`
    : 'Nomalum';
  const packageSummary = data.packageSummary ? escapeTelegramHtml(data.packageSummary) : '';
  const totalPrice = Number(data.totalPrice) || 0;

  return `
<b>Yangi lead: Jon.Branding</b>

<b>Mijoz:</b> ${fullName}
${phone ? `<b>Telefon:</b> ${phone}\n` : ''}<b>Telegram:</b> ${telegram}

<b>Rol:</b> ${escapeTelegramHtml(data.role || 'Kiritilmagan')}
<b>Oborot:</b> ${escapeTelegramHtml(data.revenue || 'Kiritilmagan')}
<b>Maqsad:</b> ${escapeTelegramHtml(data.ambition || 'Kiritilmagan')}
<b>Tosiq:</b> ${escapeTelegramHtml(data.pain || 'Kiritilmagan')}
<b>Byudjet:</b> ${escapeTelegramHtml(data.budget || 'Kiritilmagan')}

<b>Til:</b> ${escapeTelegramHtml(String(data.lang || 'uz').toUpperCase())}
<b>Manba:</b> ${escapeTelegramHtml(data.source || 'website')}
${data.ctaSource ? `<b>CTA:</b> ${escapeTelegramHtml(data.ctaSource)}\n` : ''}
${data.pagePath ? `<b>Sahifa:</b> ${escapeTelegramHtml(data.pagePath)}\n` : ''}
${data.section ? `<b>Section:</b> ${escapeTelegramHtml(data.section)}\n` : ''}
${data.offerType ? `<b>Offer:</b> ${escapeTelegramHtml(data.offerType)}\n` : ''}
${data.utmSource ? `<b>UTM:</b> ${escapeTelegramHtml([data.utmSource, data.utmMedium, data.utmCampaign].filter(Boolean).join(' / '))}\n` : ''}
${data.eventId ? `<b>Event ID:</b> ${escapeTelegramHtml(data.eventId)}\n` : ''}
${packageSummary ? `\n<b>Paket:</b> ${packageSummary}` : ''}
${totalPrice ? `\n<b>Narx:</b> ${escapeTelegramHtml(totalPrice.toLocaleString('fr-FR'))} som` : ''}
  `.trim();
}
