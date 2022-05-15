/**
 * Chooses an item from an array, with the probability of it being
 * chosen being decided by the function passed.
 */
export const chooseDependingOnRelativeProbability = <T>(
  inputArray: T[],
  /**
   * Returns a number relative to the other values
   * (i.e. does not have to be between 0 and 1)
   */
  relativeProbabilityFn: (arg0: T) => number
): T | null => {
  /** Array matching up with input array */
  const probabilityOfChoosingEach: number[] = inputArray.map((item) => {
    return relativeProbabilityFn(item);
  });
  const sumOfAllProbabilities = probabilityOfChoosingEach.reduce(
    (a, b) => a + b
  );
  if (sumOfAllProbabilities === 0) return null;
  const randomNumber = Math.random();
  let sum = 0;
  for (let i = 0; i < inputArray.length; i++) {
    sum += probabilityOfChoosingEach[i];
    if (randomNumber * sumOfAllProbabilities <= sum) {
      return inputArray[i];
    }
  }
  console.error(
    "chooseDependingOnProbability failed to choose an item, which should be impossible"
  );
  return null;
};
