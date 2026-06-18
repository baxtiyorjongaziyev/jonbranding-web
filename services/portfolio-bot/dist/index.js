import 'dotenv/config';
import { startUserbot } from './userbot.js';
startUserbot().catch((err) => {
    console.error('[fatal]', err);
    process.exit(1);
});
