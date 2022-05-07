export const removeExtraWhitespace = (input: string) => {
  if (!input) return "";
  return input.replace(/[\s]+/g, " ").trim();
};
