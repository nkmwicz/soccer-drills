// utils/storage.ts
import { v4 as uuidv4 } from "uuid";
const DB_NAME = "soccerDrillsDB";
const DRILLS_STORE = "drills";
const USERS_STORE = "users";

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Increment version for schema change

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(DRILLS_STORE)) {
        const store = db.createObjectStore(DRILLS_STORE, {
          keyPath: "drillId",
        });
        store.createIndex("drillId", "drillId", { unique: true });
      }
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const store = db.createObjectStore(USERS_STORE, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
      }
    };
  });
};

export const addUser = async (name: string) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readwrite");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.add({ id: uuidv4(), name });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getUser = async (id: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.get(id);

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

export const getAllUsers = async (): Promise<
  { id: string; name: string }[]
> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveDrillSession = async (drillId: string, datetime: Date) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRILLS_STORE, "readwrite");
    const store = transaction.objectStore(DRILLS_STORE);

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
    const transaction = db.transaction(DRILLS_STORE, "readonly");
    const store = transaction.objectStore(DRILLS_STORE);
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
    const transaction = db.transaction(DRILLS_STORE, "readonly");
    const store = transaction.objectStore(DRILLS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error);
  });
};
