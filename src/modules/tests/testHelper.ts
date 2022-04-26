/**
 * A helper to reduce boilerplate for Jest.
 * Used to test functions that only have one input.
 */
export const testSimpleInputOutput = (
  fn: Function,
  simpleInputOutputArray: Array<{ input: any; output: any }>
) => {
  test(fn.name, () => {
    simpleInputOutputArray.forEach((inputOutput) => {
      expect(fn(inputOutput.input)).toBe(inputOutput.output);
    });
  });
};

export const multipleTests = (
  fn: Function,
  array: Array<{ value: any; shouldBe: any }>
) => {
  test(fn.name, () => {
    array.forEach((item) => {
      expect(fn(item.value)).toBe(item.shouldBe);
    });
  });
};
