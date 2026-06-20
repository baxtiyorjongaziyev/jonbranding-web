import 'dotenv/config';
import { startUserbot } from './userbot.js';
import { startWorkflowLoop, runWorkflow } from './workflow.js';
const MODE = process.env.WORKFLOW_MODE ?? 'all';
async function main() {
    switch (MODE) {
        case 'telegram':
            // Faqat Telegram userbot (eski usul)
            console.log('[main] Starting Telegram-only mode');
            await startUserbot();
            break;
        case 'instagram':
            // Faqat Instagram workflow
            console.log('[main] Starting Instagram-only mode');
            await startWorkflowLoop();
            break;
        case 'once':
            // Bir marta ishga tushirish va tugatish
            console.log('[main] Running single workflow pass...');
            await runWorkflow();
            console.log('[main] Done');
            process.exit(0);
            break;
        case 'all':
        default:
            // Ikkalasini parallel ishga tushirish
            console.log('[main] Starting full mode (Telegram + Instagram + Drive + Sanity)');
            // Workflow ni alohida thread'da ishga tushirish
            startWorkflowLoop().catch((err) => {
                console.error('[main] Workflow error:', err);
            });
            // Telegram userbot ni ishga tushirish (blocking)
            await startUserbot();
            break;
    }
}
main().catch((err) => {
    console.error('[fatal]', err);
    process.exit(1);
});
