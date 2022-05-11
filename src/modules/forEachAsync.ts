/*
  Derived from Mingchen's
  https://github.com/mingchen/node-array-foreach-async#readme
  MIT
*/
export default async function forEachAsync<T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<any>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
