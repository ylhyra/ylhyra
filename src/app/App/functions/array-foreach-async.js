/* eslint-disable */
/*

  https://github.com/mingchen/node-array-foreach-async#readme
  Placed here so Babel can compile it.
  (This problem was resolved in react-scripts 2.0, could be removed)

*/

if (!Array.prototype.forEachAsync) {
  Array.prototype.forEachAsync = async function (callback) {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this);
    }
  };
}
