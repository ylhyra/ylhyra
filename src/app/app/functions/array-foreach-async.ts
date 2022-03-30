/*
  Derived from Mingchen's
  https://github.com/mingchen/node-array-foreach-async#readme
  MIT
*/
export default async function forEachAsync(
  array: any[],
  callback: (item: any, index: number, array: any[]) => Promise<any>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
