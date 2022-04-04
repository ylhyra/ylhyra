export const uppercaseFirstLetter = (input: string | null): string | null => {
  if (!input) return null;
  return input.charAt(0).toUpperCase() + input.slice(1);
};
