// Simple IndexedDB helper to store and retrieve base64/blob files with high storage quota
export const dbStore = {
  get: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('CinematicParallaxDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('assets');
      };
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction('assets', 'readonly');
          const store = transaction.objectStore('assets');
          const getReq = store.get(key);
          getReq.onsuccess = () => resolve(getReq.result || null);
          getReq.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  },
  set: (key: string, value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('CinematicParallaxDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('assets');
      };
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction('assets', 'readwrite');
          const store = transaction.objectStore('assets');
          store.put(value, key);
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
  }
};
