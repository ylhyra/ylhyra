"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("app/app/functions/math");
test("roundToSignificantDigits", () => {
    expect((0, math_1.toFixedFloat)(1.4000000000000001, 1)).toBe(1.4);
    expect((0, math_1.toFixedFloat)(1.48, 1)).toBe(1.5);
});
test("roundMsTo100Sec", () => {
    expect((0, math_1.roundMsTo100Sec)(1635608626924)).toBe(1635608600000);
});
