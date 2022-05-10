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
export const flattenArray: {
  /** Typing for thrice nested */
  <T>(array: T[][][]): T[];
  /** Typing for twice nested */
  <T>(array: T[][]): T[];
  (array: any[]): any[];
} = (data: any[]) => {
  let out: Array<any> = [];
  data.forEach((item) =>
    Array.isArray(item)
      ? (out = out.concat(flattenArray(item)))
      : out.push(item)
  );
  return out;
};
