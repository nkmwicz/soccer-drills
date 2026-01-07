// utils/storage.ts
const DB_NAME = "soccerDrillsDB";
const STORE_NAME = "drills";

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Increment version for schema change

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Remove old store if it exists
      if (db.objectStoreNames.contains("progress")) {
        db.deleteObjectStore("progress");
      }

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "drillId" });
        store.createIndex("drillId", "drillId", { unique: true });
      }
    };
  });
};

export const saveName = async (name: string) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ date: "name", name });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getName = async (): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("name");

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.name);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveDrillSession = async (drillId: string, datetime: Date) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Get existing drill record
    const getRequest = store.get(drillId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      const dates = existing ? existing.dates : [];

      // Add new datetime to the array
      dates.push(datetime);

      // Save back to store
      const putRequest = store.put({ drillId, dates });
      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getDrillSessions = async (drillId: string): Promise<Date[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(drillId);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.dates || []);
      } else {
        resolve([]);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const getAllDrills = async (): Promise<
  { drillId: string; dates: Date[] }[]
> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allRecords = request.result || [];
      // Only return records that have a dates property (actual drills)
      const drillsOnly = allRecords.filter(
        (record) => record.drillId !== undefined
      );
      if (drillsOnly.length === 0) {
        resolve([]);
        return;
      }
      resolve(drillsOnly);
    };
    request.onerror = () => reject(request.error);
  });
};
