import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';
let cachedAuthKeyData = null;
/** Service Account yoki API Key orqali auth */
async function getAuth(readOnly = true) {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const apiKey = process.env.GOOGLE_API_KEY;
    let fileExists = false;
    if (keyFile) {
        try {
            await fs.promises.access(keyFile, fs.constants.F_OK);
            fileExists = true;
        }
        catch (e) {
            fileExists = false;
        }
    }
    if (keyFile && fileExists) {
        if (!cachedAuthKeyData) {
            const data = await fs.promises.readFile(keyFile, 'utf-8');
            cachedAuthKeyData = JSON.parse(data);
        }
        return new google.auth.JWT(cachedAuthKeyData.client_email, undefined, cachedAuthKeyData.private_key, [
            readOnly
                ? 'https://www.googleapis.com/auth/drive.readonly'
                : 'https://www.googleapis.com/auth/drive',
        ]);
    }
    if (apiKey) {
        return apiKey;
    }
    throw new Error('Neither GOOGLE_SERVICE_ACCOUNT_JSON nor GOOGLE_API_KEY set');
}
/**
 * Google Drive folder ichidagi barcha rasmlarni list qiladi
 */
export async function listImagesInFolder(folderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const all = [];
    let pageToken;
    do {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
            fields: 'files(id, name, mimeType, webViewLink), nextPageToken',
            orderBy: 'name',
            pageSize: 50,
            pageToken,
        });
        const files = res.data.files ?? [];
        for (const f of files) {
            if (f.id && f.name) {
                all.push({
                    id: f.id,
                    name: f.name,
                    mimeType: f.mimeType ?? 'image/jpeg',
                    webViewLink: f.webViewLink ?? '',
                });
            }
        }
        pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);
    return all;
}
/**
 * Post/Message matnidan Google Drive folder URL larini ajratib oladi
 */
export function extractDriveUrls(text) {
    const regex = /https:\/\/(?:drive\.google\.com\/drive\/folders\/|drive\.google\.com\/open\?id=|docs\.google\.com\/folderview\?id=)([a-zA-Z0-9_-]+)/g;
    const urls = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        urls.push(match[0]);
    }
    return urls;
}
/**
 * Drive URL dan folder ID ni ajratib oladi
 */
export function extractFolderId(url) {
    const patterns = [
        /folders\/([a-zA-Z0-9_-]+)/,
        /[?&]id=([a-zA-Z0-9_-]+)/,
        /folderview\?id=([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match)
            return match[1];
    }
    return null;
}
/**
 * Drive folder haqida ma'lumot olish
 */
export async function getFolderInfo(folderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.get({
        fileId: folderId,
        fields: 'name, webViewLink, createdTime',
    });
    return {
        name: res.data.name ?? 'Unknown',
        webViewLink: res.data.webViewLink ?? '',
        createdTime: res.data.createdTime ?? '',
    };
}
/**
 * Barcha folder va rasmlarni vaqtinchalik joyga yuklab oladi
 */
export async function downloadToTemp(folderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const images = await listImagesInFolder(folderId);
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-'));
    const result = [];
    for (const img of images) {
        if (!img.id)
            continue;
        const dest = path.join(tmpDir, img.name);
        try {
            const res = await drive.files.get({ fileId: img.id, alt: 'media' }, { responseType: 'arraybuffer', timeout: 30_000 });
            fs.writeFileSync(dest, Buffer.from(res.data));
            result.push({ path: dest, mime: img.mimeType });
            console.log(`[drive-finder] Downloaded: ${img.name}`);
        }
        catch (err) {
            console.warn(`[drive-finder] Failed to download ${img.name}:`, err);
        }
    }
    return result;
}
/**
 * Berilgan parent folder ichidagi barcha papkalarni (subfolders) ro'yxatini oladi
 */
export async function listSubfolders(parentFolderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const all = [];
    let pageToken;
    do {
        const res = await drive.files.list({
            q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id, name, createdTime), nextPageToken',
            orderBy: 'createdTime desc',
            pageSize: 50,
            pageToken,
        });
        const files = res.data.files ?? [];
        for (const f of files) {
            if (f.id && f.name) {
                all.push({
                    id: f.id,
                    name: f.name,
                    createdTime: f.createdTime ?? '',
                });
            }
        }
        pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);
    return all;
}
function normalizeName(text) {
    return text
        .toLowerCase()
        // O'zbekcha ў/қ/ғ/ҳ so'zlarida apostrof harf ichida bo'ladi (masalan
        // "Sog'lom", "G'olib") — bo'shliq bilan almashtirsak so'z bo'linib
        // ketadi, shuning uchun avval shunchaki olib tashlaymiz.
        .replace(/['’‘ʻʼ`]/g, '')
        .replace(/[^a-z0-9Ѐ-ӿ؀-ۿ]+/g, ' ')
        .trim();
}
function wordOverlapScore(a, b) {
    const wa = new Set(normalizeName(a).split(' ').filter(Boolean));
    const wb = new Set(normalizeName(b).split(' ').filter(Boolean));
    if (wa.size === 0 || wb.size === 0)
        return 0;
    let overlap = 0;
    for (const w of wa)
        if (wb.has(w))
            overlap++;
    return overlap / Math.max(wa.size, wb.size);
}
/** Bo'shliqsiz shakl — "Den Aroma" va "Denaroma_2026" kabi holatlarni ham topish uchun */
function collapsedSubstringScore(a, b) {
    const ca = normalizeName(a).replace(/ /g, '');
    const cb = normalizeName(b).replace(/ /g, '');
    if (ca.length < 3 || cb.length < 3)
        return 0;
    if (ca.includes(cb) || cb.includes(ca)) {
        return Math.min(ca.length, cb.length) / Math.max(ca.length, cb.length);
    }
    return 0;
}
function nameSimilarity(a, b) {
    return Math.max(wordOverlapScore(a, b), collapsedSubstringScore(a, b));
}
/**
 * `parentFolderId` ichidagi subfolderlar orasidan `candidates` (masalan
 * [loyiha nomi, mijoz nomi]) ga eng mos keladiganini so'z-ustma-ustlik
 * (yoki bo'shliqsiz substring) bo'yicha topadi. Aniq link kerak emas —
 * faqat nom bo'yicha qidiradi.
 */
export async function findFolderByName(parentFolderId, candidates, minScore = 0.4) {
    const folders = await listSubfolders(parentFolderId);
    let best = null;
    for (const folder of folders) {
        for (const candidate of candidates) {
            if (!candidate)
                continue;
            const score = nameSimilarity(folder.name, candidate);
            if (!best || score > best.score) {
                best = { folder: { id: folder.id, name: folder.name }, score };
            }
        }
    }
    if (best && best.score >= minScore)
        return best.folder;
    return null;
}
/**
 * Berilgan folder ichidan .txt faylni qidirib, uning matnini qaytaradi
 */
export async function getTextFileContent(folderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and mimeType = 'text/plain' and trashed = false`,
            fields: 'files(id, name)',
            pageSize: 1,
        });
        const file = res.data.files?.[0];
        if (!file || !file.id)
            return null;
        const fileRes = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'text' });
        return fileRes.data;
    }
    catch (err) {
        console.warn(`[drive-finder] Failed to get txt file in folder ${folderId}`, err);
        return null;
    }
}
