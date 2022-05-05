type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Wrapper for Object.entries with types
 */
export const entries = <T extends Object>(obj: T): Entries<T> => {
  return Object.entries(obj) as any;
};

export const keys = <K extends string, T>(obj: Record<K, T>): K[] => {
  return Object.keys(obj) as K[];
};

export const values = <K extends string, T>(obj: Record<K, T>): T[] => {
  return Object.values(obj);
};
