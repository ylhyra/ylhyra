/* Simple "-s" plurals */
export const withPlural = (value, singular) => {
  return `${value} ${singular}${value === 1 ? "" : "s"}`;
};
