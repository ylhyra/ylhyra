export const average = (arr = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
};
