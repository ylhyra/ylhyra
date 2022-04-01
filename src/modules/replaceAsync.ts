/**
 * By user Overcl9ck on https://stackoverflow.com/questions/33631041/javascript-async-await-in-replace
 * CC-BY-SA
 * Comment: "It does the replace function twice so watch out if you do something heavy to process. For most usages though, it's pretty handy."
 */
export async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: () => Promise<any>
) {
  const promises: Promise<any>[] = [];
  str.replace(regex, (match, ...args) => {
    // @ts-ignore
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return "";
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}
