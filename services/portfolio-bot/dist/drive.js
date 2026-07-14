import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';
let cachedAuthKeyData = null;
async function getAuth() {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!cachedAuthKeyData) {
        const data = await fs.promises.readFile(keyFile, 'utf-8');
        cachedAuthKeyData = JSON.parse(data);
    }
    return new google.auth.JWT(cachedAuthKeyData.client_email, undefined, cachedAuthKeyData.private_key, [
        'https://www.googleapis.com/auth/drive.readonly',
    ]);
}
export async function downloadToTemp(folderId) {
    const auth = await getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const list = await drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: 'files(id, name, mimeType)',
        orderBy: 'name',
        pageSize: 20,
    });
    const files = list.data.files ?? [];
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-'));
    const results = await Promise.all(files.map(async (file) => {
        if (!file.id || !file.name)
            return null;
        const dest = path.join(tmpDir, file.name);
        const res = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' });
        await fs.promises.writeFile(dest, Buffer.from(res.data));
        return { path: dest, mime: file.mimeType ?? 'image/jpeg' };
    }));
    return results.filter((r) => r !== null);
}
