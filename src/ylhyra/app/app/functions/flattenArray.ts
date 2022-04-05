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
  let out: Array<NotArray> = [];
  data.forEach((item) =>
    Array.isArray(item)
      ? (out = out.concat(flattenArray(item)))
      : out.push(item)
  );
  return out;
}
