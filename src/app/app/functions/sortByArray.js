export const sortByArray = function (input, arrayToSortBy) {
  if (!arrayToSortBy) {
    console.error('Missing array in "sortByArray"');
    return input;
  }
  return input.sort((a, b) => {
    return arrayToSortBy.indexOf(a) - arrayToSortBy.indexOf(b);
  });
};
