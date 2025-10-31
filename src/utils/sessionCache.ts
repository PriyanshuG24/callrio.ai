// utils/sessionCache.ts
const KEY = "meeting-session-cache";

export const saveSessionData = (id: string, data: any) => {
  const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
  store[id] = data;
  sessionStorage.setItem(KEY, JSON.stringify(store));
};

export const getSessionData = (id: string) => {
  const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
  return store[id];
};

export const clearSessionData = (id: string) => {
  const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
  delete store[id];
  sessionStorage.setItem(KEY, JSON.stringify(store));
};

export const clearAllSession = () => {
  sessionStorage.removeItem(KEY);
};
