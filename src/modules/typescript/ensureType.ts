export function ensureType<T extends Record<string, any>>(obj: T): T {
  return obj;
}
