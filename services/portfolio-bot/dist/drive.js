import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';
function getAuth() {
    const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const key = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
    return new google.auth.JWT(key.client_email, undefined, key.private_key, [
        'https://www.googleapis.com/auth/drive.readonly',
    ]);
}
export async function downloadToTemp(folderId) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const list = await drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: 'files(id, name, mimeType)',
        orderBy: 'name',
        pageSize: 20,
    });
    const files = list.data.files ?? [];
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-'));
    const result = [];
    for (const file of files) {
        if (!file.id || !file.name)
            continue;
        const dest = path.join(tmpDir, file.name);
        const res = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' });
        fs.writeFileSync(dest, Buffer.from(res.data));
        result.push({ path: dest, mime: file.mimeType ?? 'image/jpeg' });
    }
    return result;
}
