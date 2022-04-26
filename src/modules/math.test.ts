import { roundMsTo100Sec, toFixedFloat } from "modules/math";
import { testSimpleInputOutput } from "modules/tests/testHelper";

test("roundToSignificantDigits", () => {
  expect(toFixedFloat(1.4000000000000001, 1)).toBe(1.4);
  expect(toFixedFloat(1.48, 1)).toBe(1.5);
});

test("roundMsTo100Sec", () => {
  expect(roundMsTo100Sec(1635608626924)).toBe(1635608600000);
});

testSimpleInputOutput(toFixedFloat, [
  { value: toFixedFloat(1.4000000000000001, 1), output: "1.4" },
  { value: toFixedFloat(1.48, 1), output: "1.5" },
]);
