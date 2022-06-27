export default <T extends Record<string, any>>(input: T): Partial<T> => {
  let out: Record<string, any> = {};
  Object.keys(input).forEach((key) => {
    if (input[key] === null || input[key] === undefined) return;
    out[key] = input[key];
  });
  return out as Partial<T>;
};
