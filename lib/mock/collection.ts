/**
 * MOCK persistence for features whose backend is not built yet. Each collection is a JSON array
 * in this browser's localStorage, seeded on first read. Replace callers' api.ts with real
 * `apiRequest` calls when the backend exists; nothing else should import this.
 */
export function mockCollection<T>(storageKey: string, seed: () => T[]) {
  function write(items: T[]) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Storage full or blocked: changes last until reload.
    }
  }

  function read(): T[] {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved) as T[];
    } catch {
      // Fall through to the seed when storage is unavailable or corrupted.
    }
    const initial = seed();
    write(initial);
    return initial;
  }

  return { read, write };
}

/** Simulates network latency so loading states are visible during development. */
export const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 150));
