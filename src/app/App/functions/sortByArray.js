if (!Array.prototype.sortByArray) {
  Array.prototype.sortByArray = function (arrayToSortBy) {
    if (!arrayToSortBy) {
      console.error('Missing array in "sortByArray"');
      return this;
    }
    return this.sort((a, b) => {
      return arrayToSortBy.indexOf(a) - arrayToSortBy.indexOf(b);
    });
  };
}
