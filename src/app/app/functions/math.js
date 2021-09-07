export const average = (arr = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
};

export const mapValueToRange = ({
  value,
  input_from,
  input_to,
  output_from,
  output_to,
  ...options
}) => {
  const slope = (output_to - output_from) / (input_to - input_from);
  const output = output_from + slope * (value - input_from);
  if (options.clamp) {
    return clamp(output, output_from, output_to);
  }
  return output;
};

export const round = (v, roundby) => {
  return Math.round(v / roundby) * roundby;
};

export const minIgnoreFalsy = (...values) => {
  return Math.min(...values.filter(Boolean));
};
