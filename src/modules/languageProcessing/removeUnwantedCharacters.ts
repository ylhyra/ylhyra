export default (input: string) => {
  if (!input) return input;
  return input
    .replace(/\u00A0/g, " ") // NBSP
    .replace(/\u8206/g, "") // LTR mark
    .replace(/\u00AD/g, ""); // Soft hyphen
};
