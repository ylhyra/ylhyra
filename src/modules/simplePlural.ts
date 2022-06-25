/** Simple English "-s" plurals */
export function withPlural(value: number | Boolean, singular: string) {
  return `${value || 0} ${singular}${value === 1 || value === true ? "" : "s"}`;
}
