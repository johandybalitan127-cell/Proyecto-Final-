// Central API service with intelligent fallback to local storage cache if json-server is offline
import initialDb from '../../db.json';

const API_BASE_URL = 'http://localhost:3001';
const STORAGE_PREFIX = 'correos_cr_db_';

// Initialize localStorage with initialDb if not present
export const initLocalStorageData = () => {
  try {
    Object.keys(initialDb).forEach((key) => {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (!stored) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialDb[key]));
      }
    });
  } catch (err) {
    console.warn('LocalStorage not available, using in-memory data', err);
  }
};

// Check if json-server is reachable
let isServerOnline = false;

export const checkServerStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/envios`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isServerOnline = res.ok;
    return isServerOnline;
  } catch {
    isServerOnline = false;
    return false;
  }
};

// Generic CRUD operations
export const fetchCollection = async (collection) => {
  initLocalStorageData();
  const online = await checkServerStatus();
  if (online) {
    try {
      const res = await fetch(`${API_BASE_URL}/${collection}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(data));
        return data;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to localStorage
  const local = localStorage.getItem(STORAGE_PREFIX + collection);
  if (local) {
    return JSON.parse(local);
  }
  return initialDb[collection] || [];
};

export const fetchItemById = async (collection, id) => {
  const items = await fetchCollection(collection);
  return items.find((item) => String(item.id) === String(id) || (item.guia && item.guia.toUpperCase() === String(id).toUpperCase()));
};

export const createItem = async (collection, item) => {
  initLocalStorageData();
  const online = await checkServerStatus();
  let newItem = { ...item };
  if (!newItem.id) {
    newItem.id = `${collection.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  }

  if (online) {
    try {
      const res = await fetch(`${API_BASE_URL}/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local storage
        const items = await fetchCollection(collection);
        localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify([...items.filter(i => i.id !== data.id), data]));
        return data;
      }
    } catch {
      // continue to local fallback
    }
  }

  // Local storage update
  const currentItems = await fetchCollection(collection);
  const updated = [newItem, ...currentItems];
  localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(updated));
  return newItem;
};

export const updateItem = async (collection, id, updates) => {
  initLocalStorageData();
  const online = await checkServerStatus();

  if (online) {
    try {
      const res = await fetch(`${API_BASE_URL}/${collection}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        const items = await fetchCollection(collection);
        const updated = items.map((it) => (it.id === id ? { ...it, ...data } : it));
        localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(updated));
        return data;
      }
    } catch {
      // continue to local fallback
    }
  }

  const items = await fetchCollection(collection);
  let updatedItem = null;
  const updated = items.map((it) => {
    if (String(it.id) === String(id)) {
      updatedItem = { ...it, ...updates };
      return updatedItem;
    }
    return it;
  });
  localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(updated));
  return updatedItem;
};

export const deleteItem = async (collection, id) => {
  initLocalStorageData();
  const online = await checkServerStatus();

  if (online) {
    try {
      await fetch(`${API_BASE_URL}/${collection}/${id}`, { method: 'DELETE' });
    } catch {
      // continue to local delete
    }
  }

  const items = await fetchCollection(collection);
  const updated = items.filter((it) => String(it.id) !== String(id));
  localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(updated));
  return true;
};
