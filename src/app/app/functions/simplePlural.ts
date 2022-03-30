/* Simple "-s" plurals */
export const withPlural = (value, singular) => {
  return `${value || 0} ${singular}${value === 1 || value === true ? "" : "s"}`;
};
