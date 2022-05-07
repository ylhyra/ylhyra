export const sortByMultipleAscending = <T extends any[]>(
  arr: T,
  ...sorters: (Function | string)[]
): T => {
  return arr.sort((a, b) => {
    for (const sorter of sorters) {
      const val1 = typeof sorter === "string" ? a[sorter] : sorter(a);
      const val2 = typeof sorter === "string" ? b[sorter] : sorter(b);
      const diff = val1 - val2;
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  });
};
