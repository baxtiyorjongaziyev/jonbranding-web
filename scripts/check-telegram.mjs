#!/usr/bin/env node
/**
 * Telegram yetkazib berishni tekshiradi va to'g'ri chat ID'ni topadi.
 *
 * Ishlatish:
 *   TELEGRAM_BOT_TOKEN=... node scripts/check-telegram.mjs
 *   TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... node scripts/check-telegram.mjs --send
 *
 * --send bayrog'isiz hech qanday xabar yuborilmaydi, faqat o'qiydi.
 */

const token = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();
const threadId = String(process.env.TELEGRAM_MESSAGE_THREAD_ID || '').trim();
const shouldSend = process.argv.includes('--send');

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN kerak.');
  process.exit(1);
}

async function api(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  });
  return response.json();
}

const me = await api('getMe');
if (!me.ok) {
  console.error('Bot token yaroqsiz:', me.description);
  process.exit(1);
}
console.log(`Bot: @${me.result.username}`);

if (chatId) {
  const chat = await api('getChat', { chat_id: chatId });
  if (chat.ok) {
    console.log(`Chat OK: ${chat.result.title || chat.result.id} (${chat.result.type})`);
    console.log(`  is_forum: ${Boolean(chat.result.is_forum)}`);
    if (threadId && !chat.result.is_forum) {
      console.log(`  DIQQAT: TELEGRAM_MESSAGE_THREAD_ID=${threadId} berilgan, lekin guruh forum emas.`);
      console.log('  Bu 400 xatosiga olib keladi — o\'zgaruvchini o\'chiring.');
    }
  } else {
    console.log(`Chat XATO: ${chat.description}`);
    console.log('  Sabablari: chat ID noto\'g\'ri, bot guruhda emas, yoki supergruppaga');
    console.log('  o\'tganda ID o\'zgargan (-100 prefiksli yangi ID kerak).');
  }
} else {
  console.log('TELEGRAM_CHAT_ID berilmagan — o\'tkazib yuborildi.');
}

// getUpdates faqat webhook o'rnatilmaganda ishlaydi.
const updates = await api('getUpdates', { limit: 20 });
if (updates.ok && updates.result.length) {
  const seen = new Map();
  for (const update of updates.result) {
    const chat = (update.message || update.channel_post || {}).chat;
    if (chat) seen.set(chat.id, chat);
  }
  if (seen.size) {
    console.log('\nBot ko\'rgan chatlar (shu ro\'yxatdan to\'g\'ri ID\'ni oling):');
    for (const chat of seen.values()) {
      console.log(`  ${chat.id}  ${chat.title || chat.username || ''} (${chat.type})`);
    }
  }
} else if (updates.ok) {
  console.log('\ngetUpdates bo\'sh. Guruhga xabar yozing va skriptni qayta ishga tushiring.');
} else {
  console.log(`\ngetUpdates ishlamadi: ${updates.description}`);
}

if (shouldSend && chatId) {
  const payload = {
    chat_id: chatId,
    text: 'Jon Branding: yetkazib berish testi.',
    ...(threadId ? { message_thread_id: Number(threadId) } : {}),
  };
  const sent = await api('sendMessage', payload);
  console.log(`\nsendMessage: ${sent.ok ? 'MUVAFFAQIYAT' : 'XATO — ' + sent.description}`);
}
