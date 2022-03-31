export default function flattenArray(data: any[]) {
  let r = [];
  data.forEach((item) =>
    Array.isArray(item) ? (r = r.concat(flattenArray(item))) : r.push(item)
  );
  return r;
}
