import fs from 'fs';
import os from 'os';
import path from 'path';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import { processPost } from './pipeline.js';
import { slugify } from './slug.js';

const API_ID = parseInt(process.env.TG_API_ID!, 10);
const API_HASH = process.env.TG_API_HASH!;
const SESSION = process.env.TG_SESSION ?? '';
const CHANNEL_IDS = (process.env.TG_CHANNEL_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const NOTIFY_CHAT_ID = process.env.TG_NOTIFY_CHAT_ID ?? '';

export let telegramClient: TelegramClient | null = null;

// Albomlar uchun buffer (groupedId -> { messages, timeout, chatId })
const albumBuffers = new Map<string, {
  messages: Api.Message[];
  timeout: NodeJS.Timeout;
  chatId: string;
}>();

export async function sendTelegramMessage(messageText: string, chatId?: string): Promise<void> {
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
  } catch (err) {
    console.error(`[userbot] Failed to send message to ${target}:`, err);
  }
}

async function handleCompletePost(
  messages: Api.Message[],
  chatId: string,
  client: TelegramClient
): Promise<void> {
  let tmpDir: string | undefined;
  try {
    // Post matnini aniqlash (birinchi matnli xabardan)
    const primaryMsg = messages.find((m) => Boolean(m.text || m.message)) || messages[0];
    const postText = primaryMsg.text || primaryMsg.message || '';

    if (!postText.trim() && messages.every((m) => !m.media)) {
      console.log('[userbot] Bo\'sh post (matn va rasm yo\'q), o\'tkazib yuborildi.');
      return;
    }

    const downloadedImages: Array<{ path: string; mime: string }> = [];

    // Rasmlarni yuklab olish
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.media) {
        try {
          if (!tmpDir) {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-portfolio-'));
          }
          const buffer = await client.downloadMedia(msg, {});
          if (buffer && Buffer.isBuffer(buffer)) {
            const filePath = path.join(tmpDir, `image_${i + 1}.jpg`);
            fs.writeFileSync(filePath, buffer);
            downloadedImages.push({ path: filePath, mime: 'image/jpeg' });
          }
        } catch (mediaErr) {
          console.warn(`[userbot] Rasm yuklab olishda xatolik (xabar #${msg.id}):`, mediaErr);
        }
      }
    }

    console.log(`[userbot] Post qayta ishlanmoqda: "${postText.slice(0, 60)}..." (${downloadedImages.length} ta rasm)`);

    const result = await processPost(postText, chatId, downloadedImages);

    if (NOTIFY_CHAT_ID) {
      const slug = slugify(result.title || 'loyiha');
      const notifyText = result.success
        ? `🤖 *Oisha:* Telegramdan yangi portfolio yaratildi!\n\n📁 *${result.title}*\n🆔 Sanity ID: \`${result.sanityId}\`\n🖼 Rasmlar: ${result.imageCount || downloadedImages.length} ta\n🌐 Saytda: https://jonbranding.uz/uz/portfolio/${slug}`
        : `⚠️ *Oisha:* Telegram postini portfolioga aylantirishda xatolik: ${result.error}`;
      await client.sendMessage(NOTIFY_CHAT_ID, { message: notifyText, parseMode: 'markdown' });
    }
  } catch (err) {
    console.error('[userbot] handleCompletePost error:', err);
  } finally {
    if (tmpDir && fs.existsSync(tmpDir)) {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
    }
  }
}

export async function syncTelegramChannel(
  channelUsernameOrId: string = '@JonBranding',
  limit: number = 30,
  clientOverride?: TelegramClient
): Promise<void> {
  const client = clientOverride || telegramClient;
  if (!client) {
    console.warn('[userbot] Cannot sync: client not initialized');
    return;
  }

  console.log(`[userbot] Syncing last ${limit} messages from ${channelUsernameOrId}...`);
  try {
    const entity = await client.getEntity(channelUsernameOrId);
    const chatId = String((entity as any).id);
    const rawMessages = await client.getMessages(entity, { limit });

    // Guruhlarga ajratish (albumlar groupedId bo'yicha, qolgani yakka)
    // Eng eskilaridan boshlab tartiblaymiz
    const messages = [...rawMessages].reverse();

    const groupedMap = new Map<string, Api.Message[]>();
    const standalone: Api.Message[][] = [];

    for (const msg of messages) {
      if (msg.groupedId) {
        const gid = String(msg.groupedId);
        if (!groupedMap.has(gid)) {
          groupedMap.set(gid, []);
        }
        groupedMap.get(gid)!.push(msg);
      } else if (msg.text || msg.message || msg.media) {
        standalone.push([msg]);
      }
    }

    const postGroups = [...groupedMap.values(), ...standalone];

    for (const group of postGroups) {
      const primaryMsg = group.find((m) => Boolean(m.text || m.message));
      const text = primaryMsg ? (primaryMsg.text || primaryMsg.message || '') : '';
      const hasMedia = group.some((m) => Boolean(m.media));

      if (!text.trim() || !hasMedia) {
        continue;
      }

      // Agar matn juda qisqa bo'lsa (masalan shunchaki havola yoki 25 ta harfdan kam), o'tkazib yuboramiz
      if (text.trim().length < 25) {
        continue;
      }

      console.log(`[userbot] Tekshirilmoqda: "${text.slice(0, 50)}..." (${group.length} ta xabar)`);
      await handleCompletePost(group, chatId, client);
    }
    console.log('[userbot] Sync complete.');
  } catch (err) {
    console.error(`[userbot] Failed to sync ${channelUsernameOrId}:`, err);
  }
}

export async function startUserbot(): Promise<void> {
  if (!API_ID || !API_HASH) throw new Error('TG_API_ID and TG_API_HASH required');
  if (CHANNEL_IDS.length === 0) throw new Error('TG_CHANNEL_IDS required (comma-separated)');

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
  const resolvedIds = new Set<string>();
  for (const id of CHANNEL_IDS) {
    try {
      const entity = await client.getEntity(id);
      const numId = String((entity as any).id);
      resolvedIds.add(numId);
      console.log(`[userbot] Resolved ${id} → ${numId}`);
    } catch (err) {
      console.warn(`[userbot] Could not resolve ${id}:`, err);
      resolvedIds.add(id.replace(/^-100/, '').replace(/^-/, ''));
    }
  }

  console.log('[userbot] Watching channel IDs:', [...resolvedIds]);

  // Avval mavjud oxirgi postlarni sinxronizatsiya qilamiz
  for (const id of CHANNEL_IDS) {
    await syncTelegramChannel(id, 30, client);
  }

  client.addEventHandler(async (event: any) => {
    try {
      const message: Api.Message = event.message;
      if (!message) return;

      const peerId = message.peerId;
      const chatId = String(
        'channelId' in peerId ? peerId.channelId :
        'chatId' in peerId ? peerId.chatId :
        'userId' in peerId ? peerId.userId : ''
      );

      if (!resolvedIds.has(chatId)) return;

      const groupedId = message.groupedId ? String(message.groupedId) : null;

      if (groupedId) {
        // Albomning bir qismi — 2.5 soniya buffer bilan to'plash
        const existing = albumBuffers.get(groupedId);
        if (existing) {
          clearTimeout(existing.timeout);
          existing.messages.push(message);
          existing.timeout = setTimeout(() => {
            albumBuffers.delete(groupedId);
            handleCompletePost(existing.messages, chatId, client);
          }, 2500);
        } else {
          const entry = {
            messages: [message],
            chatId,
            timeout: setTimeout(() => {
              albumBuffers.delete(groupedId);
              handleCompletePost(entry.messages, chatId, client);
            }, 2500),
          };
          albumBuffers.set(groupedId, entry);
        }
      } else {
        // Yagona xabar (matn yoki bitta rasm)
        console.log(`[userbot] New post from ${chatId}: ${(message.text || message.message || '').slice(0, 80)}...`);
        await handleCompletePost([message], chatId, client);
      }
    } catch (err) {
      console.error('[userbot] handler error:', err);
    }
  }, new NewMessage({}));

  await new Promise(() => {});
}
