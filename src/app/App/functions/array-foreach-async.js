/*
  Derived from Mingchen's
  https://github.com/mingchen/node-array-foreach-async#readme
  MIT
*/
const forEachAsync = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
export default forEachAsync;
