/**
 * A helper to reduce boilerplate for Jest.
 */
export const testHelper = (
  /**
   * We pass the function itself in order to get its name
   * (otherwise the test title won't update when variables are renamed)
   */
  fn: Function,
  /**
   * Array containing elements of the form [input, expectedOutput]
   */
  inputOutputPair: Array<[any, any]>
) => {
  test(fn.name, () => {
    inputOutputPair.forEach((inputOutput) => {
      expect(inputOutput[0]).toBe(inputOutput[1]);
    });
  });
};
