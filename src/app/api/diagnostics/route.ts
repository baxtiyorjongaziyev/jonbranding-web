import { NextResponse } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import {
  DEFAULT_SOURCE,
  describeAnswer,
  describeGaps,
  scoreDiagnostic,
  TOTAL_QUESTIONS,
  type AnswerSheet,
} from '@/lib/diagnostics';
import { diagnosticSubmissionSchema, splitContact } from '@/lib/diagnostics-schema';
import { guardLeadRequest } from '@/lib/lead-guard';
import { createAmoCrmLead } from '@/lib/integrations/amocrm-lead';

function cleanSecret(value: string | undefined) {
  return String(value || '')
    .replace(/^﻿/, '')
    .trim();
}

function escapeTelegramHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** CRM maydonlari — texnik topshiriqdagi nomlar bilan bir xil. */
type DiagnosticCrmRecord = {
  created_at: string;
  full_name: string;
  company_name: string;
  industry: string;
  contact: string;
  consent: boolean;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  answer_5: string;
  answer_6: string;
  answer_7: string;
  total_score: number;
  readiness: number;
  result_category: string;
  priority: string;
  sales_status: string;
  /** Sotuvga taklif qilinadigan xizmatlar — CRMdagi asosiy qiymat. */
  missing_services: string;
  /** O'sha xizmatlarning kalitlari — AmoCRMda teg sifatida, filtrlash uchun. */
  gaps: string[];
  source: string;
  page_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

function buildCrmRecord(
  data: ReturnType<typeof diagnosticSubmissionSchema.parse>,
  scoring: ReturnType<typeof scoreDiagnostic>
): DiagnosticCrmRecord {
  const answers = data.answers as AnswerSheet;
  const answerFields = Object.fromEntries(
    Array.from({ length: TOTAL_QUESTIONS }, (_, index) => [
      `answer_${index + 1}`,
      describeAnswer(index, answers[index]),
    ])
  ) as Pick<
    DiagnosticCrmRecord,
    'answer_1' | 'answer_2' | 'answer_3' | 'answer_4' | 'answer_5' | 'answer_6' | 'answer_7'
  >;

  return {
    created_at: new Date().toISOString(),
    full_name: data.fullName,
    company_name: data.companyName || '',
    industry: data.industry || '',
    contact: data.contact,
    consent: data.consent,
    ...answerFields,
    total_score: scoring.totalScore,
    readiness: scoring.readiness,
    result_category: scoring.resultCategory,
    priority: scoring.priority,
    sales_status: scoring.salesStatus,
    missing_services: describeGaps(scoring.gaps),
    gaps: scoring.gaps,
    source: data.source || DEFAULT_SOURCE,
    page_url: data.pageUrl || '',
    utm_source: data.utmSource || '',
    utm_medium: data.utmMedium || '',
    utm_campaign: data.utmCampaign || '',
  };
}

type DeliveryResult = { ok: boolean; skipped?: boolean; error?: string };

/** Sdelka izohi — CRM maydonlarining hammasi shu matnda saqlanadi. */
function buildAmoCrmNote(record: DiagnosticCrmRecord) {
  const answers = Array.from(
    { length: TOTAL_QUESTIONS },
    (_, index) => `${index + 1}. ${(record as any)[`answer_${index + 1}`]}`
  ).join('\n');

  return [
    'Brend diagnostikasi',
    `Sana: ${record.created_at}`,
    record.company_name ? `Kompaniya: ${record.company_name}` : '',
    record.industry ? `Soha: ${record.industry}` : '',
    `Aloqa: ${record.contact}`,
    `Rozilik: ${record.consent ? 'ha' : "yo'q"}`,
    '',
    // Menejer birinchi shuni ko'rishi kerak — nima taklif qilish shu yerda.
    // Bo'shliq bo'lmasa taklif satri chiqmaydi, aks holda "Jiddiy bo'shliq
    // topilmadi" o'zi taklifdek ko'rinardi.
    record.gaps.length
      ? `TAKLIF QILINADI: ${record.missing_services}`
      : "Asosiy bo'shliq topilmadi — kengaytirish bo'yicha suhbat kerak",
    '',
    'Javoblar:',
    answers,
    '',
    `Brend yetukligi: ${record.total_score}/14`,
    `Sotib olishga tayyorlik: ${record.readiness}/4`,
    `Kategoriya: ${record.result_category}`,
    `Prioritet: ${record.priority}`,
    `Sales status: ${record.sales_status}`,
    '',
    `Manba: ${record.source}`,
    record.page_url ? `Sahifa: ${record.page_url}` : '',
    record.utm_source ? `UTM source: ${record.utm_source}` : '',
    record.utm_medium ? `UTM medium: ${record.utm_medium}` : '',
    record.utm_campaign ? `UTM campaign: ${record.utm_campaign}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendToAmoCrm(
  record: DiagnosticCrmRecord,
  contact: { phone: string; telegram: string }
): Promise<DeliveryResult> {
  const result = await createAmoCrmLead({
    name: `Diagnostika: ${record.full_name}${record.company_name ? ` (${record.company_name})` : ''}`,
    contactName: record.full_name,
    phone: contact.phone,
    telegram: contact.telegram,
    tags: [
      'jonbranding.uz',
      'diagnostika',
      record.source,
      record.result_category,
      record.sales_status,
      // Xizmat teglari — menejer CRMda "kimga patent kerak" deb filtrlay oladi.
      ...record.gaps.map((gap) => `kerak:${gap}`),
    ],
    note: buildAmoCrmNote(record),
  });

  if (result.ok) return { ok: true };

  // Mock rejim: kalitlar sozlanmagan bo'lsa ham forma ishlaydi, lead loglanadi.
  if (result.skipped) {
    logger.warn('AmoCRM skipped: kalitlar sozlanmagan (mock rejim)', {
      full_name: record.full_name,
      missing_services: record.missing_services,
      total_score: record.total_score,
      readiness: record.readiness,
      result_category: record.result_category,
      priority: record.priority,
      sales_status: record.sales_status,
      source: record.source,
    });
    return { ok: false, skipped: true };
  }

  return { ok: false, error: result.error };
}

function buildTelegramMessage(record: DiagnosticCrmRecord) {
  const answers = Array.from(
    { length: TOTAL_QUESTIONS },
    (_, index) => `${index + 1}. ${escapeTelegramHtml((record as any)[`answer_${index + 1}`])}`
  ).join('\n');

  return [
    '<b>Brend diagnostikasi: yangi lead</b>',
    '',
    `<b>Ism:</b> ${escapeTelegramHtml(record.full_name)}`,
    record.company_name ? `<b>Kompaniya:</b> ${escapeTelegramHtml(record.company_name)}` : '',
    record.industry ? `<b>Soha:</b> ${escapeTelegramHtml(record.industry)}` : '',
    `<b>Aloqa:</b> ${escapeTelegramHtml(record.contact)}`,
    '',
    record.gaps.length
      ? `<b>TAKLIF QILINADI:</b> ${escapeTelegramHtml(record.missing_services)}`
      : "<b>Asosiy bo'shliq topilmadi</b> — kengaytirish bo'yicha suhbat kerak",
    '',
    `<b>Brend yetukligi:</b> ${record.total_score}/14`,
    `<b>Sotib olishga tayyorlik:</b> ${record.readiness}/4`,
    `<b>Kategoriya:</b> ${escapeTelegramHtml(record.result_category)}`,
    `<b>Prioritet:</b> ${escapeTelegramHtml(record.priority)}`,
    `<b>Sales status:</b> ${escapeTelegramHtml(record.sales_status)}`,
    '',
    '<b>Javoblar:</b>',
    answers,
    '',
    `<b>Manba:</b> ${escapeTelegramHtml(record.source)}`,
    record.utm_source ? `<b>UTM source:</b> ${escapeTelegramHtml(record.utm_source)}` : '',
    record.utm_medium ? `<b>UTM medium:</b> ${escapeTelegramHtml(record.utm_medium)}` : '',
    record.utm_campaign ? `<b>UTM campaign:</b> ${escapeTelegramHtml(record.utm_campaign)}` : '',
    record.page_url ? `<b>Sahifa:</b> ${escapeTelegramHtml(record.page_url)}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendToTelegram(record: DiagnosticCrmRecord): Promise<DeliveryResult> {
  const botToken = cleanSecret(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = cleanSecret(process.env.TELEGRAM_CHAT_ID);
  const threadId = cleanSecret(process.env.TELEGRAM_MESSAGE_THREAD_ID);

  if (!botToken || !chatId) {
    logger.warn("Telegram skipped: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo'q (mock rejim)");
    return { ok: false, skipped: true };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(record),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...(threadId ? { message_thread_id: Number(threadId) } : {}),
      }),
    });
    const result: any = await response.json().catch(() => null);

    if (!response.ok || result?.ok === false) {
      throw new Error(result?.description || `Telegram HTTP ${response.status}`);
    }

    return { ok: true };
  } catch (error) {
    logger.error('Telegram diagnostic alert error', { error: String(error) });
    return { ok: false, error: String(error) };
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // rateLimit async — await bo'lmasa Promise doim truthy bo'lib, cheklov ishlamaydi.
  if (!(await rateLimit(`diagnostics:${ip}`, 5, 60_000))) {
    return NextResponse.json(
      { ok: false, error: "Juda ko'p urinish. Bir daqiqadan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    const body = await request.json();

    const guard = await guardLeadRequest(request, body, ip, 'diagnostics');
    if (guard.action === 'drop') {
      // Botga haqiqiy natija shaklidagi javob qaytaramiz, lekin hech qayerga yubormaymiz.
      return NextResponse.json({
        ok: true,
        totalScore: 0,
        resultCategory: 'nurture',
        delivery: { amoCrm: true, telegram: true, mock: false },
      });
    }
    if (guard.action === 'reject') {
      return NextResponse.json(
        { ok: false, error: 'Tekshiruvdan o‘tmadi. Sahifani yangilab, qayta urinib ko‘ring.' },
        { status: 400 }
      );
    }

    parsed = diagnosticSubmissionSchema.safeParse(body);
  } catch {
    return NextResponse.json({ ok: false, error: "Ma'lumot formati noto'g'ri" }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Ma'lumotlar to'liq emas", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const scoring = scoreDiagnostic(data.answers as AnswerSheet);
  const record = buildCrmRecord(data, scoring);
  const { phone, telegram } = splitContact(data.contact);

  // CRM yoki Telegram xatosi foydalanuvchini bloklamaydi — natija baribir ko'rsatiladi.
  const [amoCrm, telegramResult] = await Promise.all([
    sendToAmoCrm(record, { phone, telegram }).catch((error) => ({
      ok: false,
      error: String(error),
    })),
    sendToTelegram(record).catch((error) => ({ ok: false, error: String(error) })),
  ]);

  logger.info('Diagnostic submission processed', {
    eventId: data.eventId,
    total_score: scoring.totalScore,
    result_category: scoring.resultCategory,
    source: record.source,
    contactType: phone ? 'phone' : telegram ? 'telegram' : 'unknown',
    amoCrm: amoCrm.ok,
    telegram: telegramResult.ok,
  });

  return NextResponse.json({
    ok: true,
    // Ichki tasnif (priority / sales_status) javobga qaytarilmaydi.
    totalScore: scoring.totalScore,
    resultCategory: scoring.resultCategory,
    delivery: {
      amoCrm: amoCrm.ok,
      telegram: telegramResult.ok,
      mock: Boolean((amoCrm as DeliveryResult).skipped && (telegramResult as DeliveryResult).skipped),
    },
  });
}
