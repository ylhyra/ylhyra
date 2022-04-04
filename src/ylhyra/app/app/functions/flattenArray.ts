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
export default function flattenArray(data: any[]): Array<NotArray> {
  let r: Array<NotArray> = [];
  data.forEach((item) =>
    Array.isArray(item) ? (r = r.concat(flattenArray(item))) : r.push(item)
  );
  return r;
}
