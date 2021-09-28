/**
 * Memoized sort based on a function, ascending
 */
export const sortBy = (input, func) => {
  return input
    .map((item) => ({
      item,
      sortKey: func(item),
    }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((j) => j.item);
};
