/**
 * Sorts array A in the order of array B.
 */
export const sortByArray = function (
  input: any[],
  arrayToSortBy: any[]
): any[] {
  if (!arrayToSortBy) {
    console.error('Missing array in "sortByArray"');
    return input;
  }
  return input.sort((a, b) => {
    return arrayToSortBy.indexOf(a) - arrayToSortBy.indexOf(b);
  });
};
