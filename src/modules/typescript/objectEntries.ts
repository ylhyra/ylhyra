type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Wrapper for Object.entries with types
 */
export const entries = <T>(obj: T): Entries<T> => Object.entries(obj) as any;
