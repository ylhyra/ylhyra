import { roundMsTo100Sec, toFixedFloat } from "modules/math";
import { testHelper } from "modules/tests/testHelper";

testHelper(toFixedFloat, [
  [toFixedFloat(1.4000000000000001, 1), "1.4"],
  [toFixedFloat(1.48, 1), "1.5"],
]);

testHelper(roundMsTo100Sec, [[roundMsTo100Sec(1635608626924), 1635608600000]]);
