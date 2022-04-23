/**
 * Simple English "-s" plurals
 */
export const withPlural = (value: number | Boolean, singular: string) => {
  return `${value || 0} ${singular}${value === 1 || value === true ? "" : "s"}`;
};
