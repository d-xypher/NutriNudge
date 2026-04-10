import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let _db: Firestore | null = null;

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIRESTORE_PROJECT_ID || 'demo-project-id';
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credentialsPath) {
    try {
      const absolutePath = resolve(process.cwd(), credentialsPath);
      const raw = readFileSync(absolutePath, 'utf-8');
      const serviceAccount = JSON.parse(raw);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch (e) {
      console.warn('Could not load credentials file, falling back to default credentials:', e);
    }
  }

  // Cloud Run or gcloud CLI — uses application default credentials
  try {
    return initializeApp({
      credential: applicationDefault(),
      projectId,
    });
  } catch {
    // Final fallback — no credentials (build time)
    return initializeApp({ projectId });
  }
}

export function getDb(): Firestore {
  if (!_db) {
    const app = getFirebaseApp();
    _db = getFirestore(app);
  }
  return _db;
}

// Lazy getter — only initializes when actually called by an API route
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const realDb = getDb();
    const value = (realDb as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(realDb);
    }
    return value;
  },
});
