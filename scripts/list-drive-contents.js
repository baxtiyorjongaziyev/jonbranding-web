const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Could not find .env.local file at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
let saJsonBase64 = '';
const lines = envContent.split('\n');
for (const line of lines) {
  if (line.startsWith('FIREBASE_SERVICE_ACCOUNT_JSON=')) {
    saJsonBase64 = line.substring('FIREBASE_SERVICE_ACCOUNT_JSON='.length).trim();
  }
}
if (saJsonBase64.startsWith('"') && saJsonBase64.endsWith('"')) saJsonBase64 = saJsonBase64.substring(1, saJsonBase64.length - 1);
if (saJsonBase64.startsWith("'") && saJsonBase64.endsWith("'")) saJsonBase64 = saJsonBase64.substring(1, saJsonBase64.length - 1);

const saJson = Buffer.from(saJsonBase64, 'base64').toString('utf8');
const key = JSON.parse(saJson);

const auth = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });

const parentFolderId = '1yn5cWrxUvND7iYO79-KK5zUfKU4JvuM0';
const subfolderId = '1WrMdXDI_vIskVXCE0SJ79C1AbcaQuz4h';

async function list() {
  try {
    console.log('--- Listing Parent Folder Contents ---');
    const parentList = await drive.files.list({
      q: `'${parentFolderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
    });
    for (const f of parentList.data.files || []) {
      console.log(`- [${f.mimeType}] ${f.name} (ID: ${f.id})`);
    }

    console.log('\n--- Listing Savod Subfolder Contents ---');
    const subList = await drive.files.list({
      q: `'${subfolderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
    });
    for (const f of subList.data.files || []) {
      console.log(`- [${f.mimeType}] ${f.name} (ID: ${f.id})`);
    }
  } catch (err) {
    console.error('Error listing Drive files:', err.message || err);
  }
}

list();
