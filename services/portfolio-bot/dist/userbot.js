import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import { processPost } from './pipeline.js';
const API_ID = parseInt(process.env.TG_API_ID, 10);
const API_HASH = process.env.TG_API_HASH;
const SESSION = process.env.TG_SESSION ?? '';
const CHANNEL_IDS = (process.env.TG_CHANNEL_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const NOTIFY_CHAT_ID = process.env.TG_NOTIFY_CHAT_ID ?? '';
export let telegramClient = null;
export async function sendTelegramMessage(messageText, chatId) {
    const target = chatId ?? NOTIFY_CHAT_ID;
    if (!target) {
        console.warn('[userbot] No target chat configured for sendTelegramMessage');
        return;
    }
    if (!telegramClient) {
        console.warn('[userbot] Telegram client not initialized yet');
        return;
    }
    try {
        await telegramClient.sendMessage(target, { message: messageText, parseMode: 'markdown' });
        console.log(`[userbot] Sent notification to ${target}`);
    }
    catch (err) {
        console.error(`[userbot] Failed to send message to ${target}:`, err);
    }
}
export async function startUserbot() {
    if (!API_ID || !API_HASH)
        throw new Error('TG_API_ID and TG_API_HASH required');
    if (CHANNEL_IDS.length === 0)
        throw new Error('TG_CHANNEL_IDS required (comma-separated)');
    const session = new StringSession(SESSION);
    const client = new TelegramClient(session, API_ID, API_HASH, {
        connectionRetries: 5,
    });
    telegramClient = client;
    await client.start({
        phoneNumber: async () => { throw new Error('No session — run auth.ts first'); },
        password: async () => '',
        phoneCode: async () => '',
        onError: (err) => console.error('[userbot] auth error:', err),
    });
    // Resolve usernames (@JonBranding) and numeric IDs to canonical numeric strings
    const resolvedIds = new Set();
    for (const id of CHANNEL_IDS) {
        try {
            const entity = await client.getEntity(id);
            const numId = String(entity.id);
            resolvedIds.add(numId);
            console.log(`[userbot] Resolved ${id} → ${numId}`);
        }
        catch (err) {
            console.warn(`[userbot] Could not resolve ${id}:`, err);
            resolvedIds.add(id.replace(/^-100/, '').replace(/^-/, ''));
        }
    }
    console.log('[userbot] Watching channel IDs:', [...resolvedIds]);
    client.addEventHandler(async (event) => {
        try {
            const message = event.message;
            if (!message?.text)
                return;
            const peerId = message.peerId;
            const chatId = String('channelId' in peerId ? peerId.channelId :
                'chatId' in peerId ? peerId.chatId :
                    'userId' in peerId ? peerId.userId : '');
            if (!resolvedIds.has(chatId))
                return;
            console.log(`[userbot] New post from ${chatId}: ${message.text.slice(0, 80)}...`);
            const result = await processPost(message.text, chatId);
            if (NOTIFY_CHAT_ID) {
                const notifyText = result.success
                    ? `✅ Portfolio yaratildi: *${result.title}*\nSanity ID: \`${result.sanityId}\``
                    : `❌ Xato: ${result.error}`;
                await client.sendMessage(NOTIFY_CHAT_ID, { message: notifyText, parseMode: 'markdown' });
            }
        }
        catch (err) {
            console.error('[userbot] handler error:', err);
        }
    }, new NewMessage({}));
    await new Promise(() => { });
}
