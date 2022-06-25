export function arrayIncludesAnyOfOtherArray(haystack: any[], arr: any[]) {
  if (!arr) return false;
  if (typeof arr === "string") {
    arr = [arr];
  }
  return arr.some((v) => {
    return haystack.indexOf(v) >= 0;
  });
}
