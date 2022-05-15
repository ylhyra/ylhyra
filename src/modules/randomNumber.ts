// @ts-ignore
import fastRandom from "fast-random";

let instance: any;
const getRandomNumberGenerator = () => {
  return instance || (instance = fastRandom(Date.now()));
};

/**
 * Fast random number generator.
 * Returns a number between 0 and 1.
 */
export const getRandomNumberFast = (): number => {
  return getRandomNumberGenerator().nextFloat();
};

export const seedRandomNumberGenerator = () => {
  getRandomNumberGenerator().seed(Date.now());
};
