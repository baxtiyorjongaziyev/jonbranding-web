import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getDb() {
  let app;
  if (!getApps().length) {
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!saJson) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    app = initializeApp({ credential: cert(JSON.parse(saJson)) });
  } else {
    app = getApps()[0];
  }
  const dbId = process.env.FIREBASE_DATABASE_ID || 'ai-studio-cab24ca1-84fa-4f82-b5cb-5ab2ebac8a44';
  return getFirestore(app, dbId);
}
