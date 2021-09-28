export const ucfirst = (input) => {
  if (!input) return null;
  return input.charAt(0).toUpperCase() + input.slice(1);
};
