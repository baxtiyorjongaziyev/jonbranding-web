import 'dotenv/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { syncTelegramChannel } from './userbot.js';
const apiId = parseInt(process.env.TG_API_ID || '', 10);
const apiHash = process.env.TG_API_HASH || '';
const sessionStr = process.env.TG_SESSION || '';
if (!apiId || !apiHash || !sessionStr) {
    console.error('[sync] TG_API_ID, TG_API_HASH, and TG_SESSION must be set in .env');
    process.exit(1);
}
const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, {
    connectionRetries: 3,
});
async function main() {
    await client.connect();
    console.log('[sync] Connected to Telegram. Starting sync...');
    const channels = process.env.TG_CHANNEL_IDS || '@JonBranding';
    for (const ch of channels.split(',').map((s) => s.trim()).filter(Boolean)) {
        await syncTelegramChannel(ch, 30, client);
    }
    console.log('[sync] All done!');
    await client.disconnect();
}
main().catch((err) => {
    console.error('[sync] Fatal error:', err);
    process.exit(1);
});
