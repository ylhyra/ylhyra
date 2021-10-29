import { toFixedFloat } from "app/app/functions/math";

test("roundToSignificantDigits", () => {
  expect(toFixedFloat(1.4000000000000001, 1)).toBe(1.4);
  expect(toFixedFloat(1.48, 1)).toBe(1.5);
});
