import type { Firestore } from 'firebase-admin/firestore';
import { logger } from '@/lib/logger';

export function getDb(): Firestore {
  // Lazy require: firebase-admin pulls protobufjs, which uses eval and crashes
  // at module load on Cloudflare Workers even when Firestore is never used.
  const { cert, getApps, initializeApp } = require('firebase-admin/app') as typeof import('firebase-admin/app');
  const { getFirestore } = require('firebase-admin/firestore') as typeof import('firebase-admin/firestore');
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
        logger.error('Failed to decode base64 service account JSON:', e);
      }
    }
    
    app = initializeApp({ credential: cert(JSON.parse(saJson)) });
  } else {
    app = getApps()[0];
  }
  const dbId = process.env.FIREBASE_DATABASE_ID ?? 'ai-studio-cab24ca1-84fa-4f82-b5cb-5ab2ebac8a44';
  return getFirestore(app, dbId);
}
