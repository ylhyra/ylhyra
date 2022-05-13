export type NotArray =
  | object
  | string
  | bigint
  | number
  | boolean
  | null
  | undefined;
//   & {
//   length?: never;
// };

/**
 * Flattens array deeply
 */
export function flattenArray(data: any[]) {
  let out: Array<any> = [];
  data.forEach((item) =>
    Array.isArray(item)
      ? (out = out.concat(flattenArray(item)))
      : out.push(item)
  );
  return out;
}
