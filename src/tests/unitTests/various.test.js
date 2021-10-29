import { roundToSignificantDigits } from "app/app/functions/math";

test("roundToSignificantDigits", () => {
  expect(roundToSignificantDigits(1.4000000000000001, -1)).toBe(1.4);
  expect(roundToSignificantDigits(1.48, -1)).toBe(1.5);
});
