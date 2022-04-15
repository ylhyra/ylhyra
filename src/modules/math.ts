import { Milliseconds, seconds } from "modules/time";

export const average = (arr: number[] = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const clamp = function (input: number, min: number, max: number) {
  return minIgnoreUndef(maxIgnoreUndef(input, min), max);
};

export const mapValueToRange = ({
  value,
  input_from,
  input_to,
  output_from,
  output_to,
  ...options
}: {
  value: number;
  input_from: number;
  input_to: number;
  output_from: number;
  output_to: number;
  clamp?: boolean;
}) => {
  const slope = (output_to - output_from) / (input_to - input_from);
  const output = output_from + slope * (value - input_from);
  if (options.clamp) {
    return clamp(output, output_from, output_to);
  }
  return output;
};

export const minIgnoreFalsy = (...values: any[]) => {
  return minIgnoreUndef(...values.filter(Boolean));
};

export const maxIgnoreFalsy = (...values: any[]) => {
  return maxIgnoreUndef(...values.filter(Boolean));
};

export const minIgnoreUndef = (...values: (number | undefined | null)[]) => {
  const j = Math.min(
    ...(values.filter((i) => i !== undefined && i !== null) as number[])
  );
  return j !== Infinity ? j : null;
};

export const maxIgnoreUndef = (...values: (number | undefined | null)[]) => {
  const j = Math.max(
    ...(values.filter((i) => i !== undefined && i !== null) as number[])
  );
  return j !== -Infinity ? j : null;
};

/**
 * Randomly adds or subtracts up to 10% of the input
 */
export const addSomeRandomness = (input: number, amount = 0.1) => {
  return input + input * amount * (Math.random() - 0.5) * 2;
};

export const roundToInterval = (v: number, roundBy: number) => {
  return Math.round(v / roundBy) * roundBy;
};

export const roundMsToSec = (v: Milliseconds) => {
  return roundToInterval(v, seconds);
};

export const roundMsTo100Sec = (v: Milliseconds) => {
  return roundToInterval(v, 100 * seconds);
};

export const toFixedFloat = (input: number, f: number) => {
  return parseFloat(input.toFixed(f));
};

/**
 * A simple `(x / (x + a))` curve, where `a` is small
 */
export const mapZeroToInfinityToZeroToOne = ({
  input,
  goalInput,
  goalOutput,
  pow = 1.4,
}: {
  input: number;
  goalInput: number;
  goalOutput: number;
  pow?: number;
}) => {
  input **= pow;
  goalInput **= pow;
  if (goalOutput > 1) throw new Error();
  const a = (goalInput - goalOutput * goalInput) / goalOutput;
  return input / (input + a);
};
