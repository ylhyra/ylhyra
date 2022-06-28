export function arrayIncludesAnyOfOtherArray(arr1: any[], arr2: any[]) {
  if (!arr2) return false;
  if (typeof arr2 === "string") {
    arr2 = [arr2];
  }
  return arr2.some((v) => {
    return arr1.indexOf(v) >= 0;
  });
}
