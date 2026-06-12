import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getDb() {
  let app;
  if (!getApps().length) {
    let saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!saJson) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    
    // Support base64 encoded service account json to prevent env parsing issues
    saJson = saJson.trim();
    if (!saJson.startsWith('{')) {
      try {
        saJson = Buffer.from(saJson, 'base64').toString('utf8');
      } catch (e) {
        console.error('Failed to decode base64 service account JSON:', e);
      }
    }
    
    app = initializeApp({ credential: cert(JSON.parse(saJson)) });
  } else {
    app = getApps()[0];
  }
  const dbId = process.env.FIREBASE_DATABASE_ID;
  if (!dbId) throw new Error('FIREBASE_DATABASE_ID is not set');
  return getFirestore(app, dbId);
}