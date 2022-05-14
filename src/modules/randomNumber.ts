// @ts-ignore
import fastRandom from "fast-random";

const x = fastRandom();

/**
 * Returns a number between 0 and 1.
 */
export const getRandomNumberFast = (): number => {
  return x.nextFloat();
};

export const seedRandomNumberGenerator = () => {
  x.seed(Date.now());
};
