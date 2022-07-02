export function sortByMultiple<T>(
  arr: T[],
  ...sortBy: Array<(arg0: T) => number>
): T[] {
  return arr.sort((a, b) => {
    for (const sortByFunc of sortBy) {
      // todo cache?
      const result = sortByFunc(a) - sortByFunc(b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
}
