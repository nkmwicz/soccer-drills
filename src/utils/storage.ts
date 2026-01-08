// utils/storage.ts
import { v4 as uuidv4 } from "uuid";
const DB_NAME = "soccerDrillsDB";
const DRILLS_STORE = "drills";
const USERS_STORE = "users";

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3); // Increment version for schema change

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(DRILLS_STORE)) {
        const store = db.createObjectStore(DRILLS_STORE, {
          keyPath: "id", // Composite key: userId-drillId
        });
        store.createIndex("userId", "userId", { unique: false }); // Query by user
        store.createIndex("drillId", "drillId", { unique: false });
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

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getUser = async (
  id: string
): Promise<{ id: string; name: string } | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, "readonly");
    const store = transaction.objectStore(USERS_STORE);
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
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

export const saveDrillSession = async (
  userId: string,
  drillId: string,
  datetime: Date
) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRILLS_STORE, "readwrite");
    const store = transaction.objectStore(DRILLS_STORE);

    const id = `${userId}-${drillId}`; // Composite key
    // Get existing drill record
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      const dates = existing ? existing.dates : [];

      // Add new datetime to the array
      dates.push(datetime);

      // Save back to store
      const putRequest = store.put({ id, userId, drillId, dates });
      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getDrillSessions = async (
  userId: string,
  drillId: string
): Promise<Date[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRILLS_STORE, "readonly");
    const store = transaction.objectStore(DRILLS_STORE);
    const id = `${userId}-${drillId}`;
    const request = store.get(id);

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

export const getAllDrills = async (
  userId: string
): Promise<
  { id: string; userId: string; drillId: string; dates: Date[] }[]
> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRILLS_STORE, "readonly");
    const store = transaction.objectStore(DRILLS_STORE);
    const index = store.index("userId");
    const request = index.getAll(userId);

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error);
  });
};
