import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getDb() {
  if (!getApps().length) {
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!saJson) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    initializeApp({ credential: cert(JSON.parse(saJson)) });
  }
  return getFirestore();
}
