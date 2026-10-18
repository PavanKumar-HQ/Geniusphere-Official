// ====================================================================
// Geniusphere — Client-Side Persistent IndexedDB Storage Engine
// Provides high-capacity, zero-data-loss storage for learning records
// ====================================================================

const DB_NAME = 'geniusphere_sovereign_db_v2';
const DB_VERSION = 1;
const STORE_NAME = 'entities';

interface PersistedStatePayload {
  submissions?: [string, any][];
  assignments?: [string, any][];
  classrooms?: [string, any][];
  enrollments?: [string, any][];
  labAttempts?: [string, any][];
  courseEnrollments?: [string, any][];
  userProgress?: [string, any][];
  certificates?: [string, any][];
  studentResumes?: [string, any][];
  auditEvents?: [string, any][];
  updated_at: string;
}

class SovereignIndexedDB {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = window.indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => {
            console.warn('[Geniusphere IndexedDB] Open failed, fallback to memory/localStorage');
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    }
    return this.dbPromise;
  }

  async saveState(state: PersistedStatePayload): Promise<boolean> {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(state, 'latest_state');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async loadState(): Promise<PersistedStatePayload | null> {
    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('latest_state');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
}

export const sovereignDB = new SovereignIndexedDB();
