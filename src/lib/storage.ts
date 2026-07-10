// Simple IndexedDB helper to store and retrieve base64/blob files with high storage quota
export const dbStore = {
  get: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      // First try to read from the new LumenCityDB
      const request = indexedDB.open('LumenCityDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('assets');
      };
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction('assets', 'readonly');
          const store = transaction.objectStore('assets');
          const getReq = store.get(key);
          getReq.onsuccess = () => {
            if (getReq.result) {
              resolve(getReq.result);
            } else {
              // Fallback: try reading from the old CinematicParallaxDB
              const fallbackRequest = indexedDB.open('CinematicParallaxDB', 1);
              fallbackRequest.onupgradeneeded = () => {
                fallbackRequest.result.createObjectStore('assets');
              };
              fallbackRequest.onsuccess = () => {
                const fbDb = fallbackRequest.result;
                try {
                  const fbTransaction = fbDb.transaction('assets', 'readonly');
                  const fbStore = fbTransaction.objectStore('assets');
                  const fbGetReq = fbStore.get(key);
                  fbGetReq.onsuccess = () => {
                    if (fbGetReq.result) {
                      // Migrate it to the new database asynchronously for future loads
                      dbStore.set(key, fbGetReq.result);
                      resolve(fbGetReq.result);
                    } else {
                      resolve(null);
                    }
                  };
                  fbGetReq.onerror = () => resolve(null);
                } catch (e) {
                  resolve(null);
                }
              };
              fallbackRequest.onerror = () => resolve(null);
            }
          };
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
      const request = indexedDB.open('LumenCityDB', 1);
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
