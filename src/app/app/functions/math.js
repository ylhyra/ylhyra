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

export const minIgnoreFalsy = (...values) => {
  return Math.min(...values.filter(Boolean));
};

/**
 * Randomly adds or subtracts up to 10% of the input
 */
export const addSomeRandomness = (input, amount = 0.1) => {
  return input + input * amount * (Math.random() - 0.5) * 2;
};

export const roundToInterval = (v, roundBy) => {
  return Math.round(v / roundBy) * roundBy;
};

export const roundToSignificantDigits = (input, zeroes = 0) => {
  if (zeroes > 0) {
    const i = 10 ** zeroes;
    return Math.round(input / i) * i;
  } else {
    return parseFloat(input.toFixed(-zeroes));
  }
};

// /**
//  * Ratio between the larger number and the smaller number
//  */
// export const ratio = (first, second) => {
//   if (first > second) {
//     return first / second;
//   }
//   return second / first;
// };

/*
  A simple (x / (x + a)) curve, where a is small
 */
export const mapZeroToInfinityToZeroToOne = ({
  input,
  goal_input,
  goal_output,
  pow = 1.4,
}) => {
  input **= pow;
  goal_input **= pow;
  if (goal_output > 1) throw new Error();
  const a = (goal_input - goal_output * goal_input) / goal_output;
  return input / (input + a);
};
