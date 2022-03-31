export const removeExtraWhitespace = (input) => {
  if (!input) return "";
  return input.replace(/[\s]+/g, " ").trim();
};
