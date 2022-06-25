import { Milliseconds, seconds } from "modules/time";

export function average(arr: number[] = []) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export const clamp = (input: number, min: number, max: number): number => {
  return minIgnoreUndef(maxIgnoreUndef(input, min), max)!;
};

export const mapValueToRange = ({
  value,
  inputFrom,
  inputTo,
  outputFrom,
  outputTo,
  ...options
}: {
  value: number;
  inputFrom: number;
  inputTo: number;
  outputFrom: number;
  outputTo: number;
  clamp?: boolean;
}) => {
  const slope = (outputTo - outputFrom) / (inputTo - inputFrom);
  const output = outputFrom + slope * (value - inputFrom);
  if (options.clamp) {
    return clamp(output, outputFrom, outputTo);
  }
  return output;
};

export function minIgnoreFalsy(...values: any[]) {
  return minIgnoreUndef(...values.filter(Boolean));
}

export function maxIgnoreFalsy(...values: any[]) {
  return maxIgnoreUndef(...values.filter(Boolean));
}

export function minIgnoreUndef(...values: (number | undefined | null)[]) {
  const j = Math.min(
    ...(values.filter((i) => i !== undefined && i !== null) as number[])
  );
  return j !== Infinity ? j : null;
}

export function maxIgnoreUndef(...values: (number | undefined | null)[]) {
  const j = Math.max(
    ...(values.filter((i) => i !== undefined && i !== null) as number[])
  );
  return j !== -Infinity ? j : null;
}

/** Randomly adds or subtracts up to 10% of the input */
export function addSomeRandomness(input: number, amount = 0.1) {
  return input + input * amount * (Math.random() - 0.5) * 2;
}

export function roundToInterval(v: number, roundBy: number) {
  return Math.round(v / roundBy) * roundBy;
}

export function roundMsToSec(v: Milliseconds) {
  return roundToInterval(v, seconds);
}

/** @hasTests */
export const roundMsTo100Sec = (v: Milliseconds) => {
  return roundToInterval(v, 100 * seconds);
};

/** @hasTests */
export function toFixedFloat(input: number, f: number) {
  return parseFloat(input.toFixed(f));
}

/** A simple `(x / (x + a))` curve, where `a` is small */
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
