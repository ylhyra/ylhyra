import { roundMsTo100Sec, toFixedFloat } from "modules/math";

test("", () => {
  expect(toFixedFloat(1.4000000000000001, 1)).toBe(1.4);
  expect(toFixedFloat(1.48, 1)).toBe(1.5);
});

test("", () => {
  expect(roundMsTo100Sec(1635608626924)).toBe(1635608600000);
});
