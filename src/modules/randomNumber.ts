// @ts-ignore
import fastRandom from "fast-random";

/**
 * Returns a function that when called returns a number between 0 and 1.
 *
 * Usage:
 *    const getRandomNumber = randomNumberGenerator(Date.now());
 *    getRandomNumber();
 */
export const randomNumberGenerator = (): (() => number) => {
  const x = fastRandom(Date.now());
  return x.nextFloat;
};