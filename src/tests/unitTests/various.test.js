import { roundMsTo100Sec, toFixedFloat } from "app/app/functions/math";

test("roundToSignificantDigits", () => {
  expect(toFixedFloat(1.4000000000000001, 1)).toBe(1.4);
  expect(toFixedFloat(1.48, 1)).toBe(1.5);
});

test("roundMsTo100Sec", () => {
  expect(roundMsTo100Sec(1635608626924)).toBe(1635608600000);
});
