import { google } from 'googleapis';

function getAuth() {
  let saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  }
  if (!saJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON must be set');
  }

  saJson = saJson.trim();
  if (!saJson.startsWith('{')) {
    try {
      saJson = Buffer.from(saJson, 'base64').toString('utf8');
    } catch (e) {
      console.error('Failed to decode base64 Google Service Account JSON:', e);
    }
  }

  const key = JSON.parse(saJson);
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}

export interface DriveFolder {
  id: string;
  name: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export async function findFolderByName(name: string): Promise<string | null> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.list({
    q: `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 1,
  });

  const files = res.data.files ?? [];
  return files[0]?.id ?? null;
}

export async function listSubfolders(parentFolderId: string): Promise<DriveFolder[]> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name',
    pageSize: 100,
  });

  const files = res.data.files ?? [];
  return files.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? '',
  })).filter(f => f.id !== '');
}

export async function listFiles(folderId: string): Promise<DriveFile[]> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
    orderBy: 'name',
    pageSize: 100,
  });

  const files = res.data.files ?? [];
  return files.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? '',
    mimeType: f.mimeType ?? '',
  })).filter(f => f.id !== '');
}

export async function downloadFileBuffer(fileId: string): Promise<Buffer> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(res.data as ArrayBuffer);
}
