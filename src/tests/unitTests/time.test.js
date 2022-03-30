"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = require("app/app/functions/time");
test("prettyPrintDaysMinutesHours", () => {
    expect((0, time_1.prettyPrintDaysMinutesHours)(12 * time_1.days + 10 * time_1.minutes)).toBe("12 days, 10 minutes");
    expect((0, time_1.prettyPrintDaysMinutesHours)(2 * time_1.days + 23 * time_1.hours + 100 * time_1.seconds)).toBe("2 days, 23 hours");
    expect((0, time_1.prettyPrintDaysMinutesHours)(12 * time_1.hours + 10 * time_1.seconds)).toBe("12 hours");
});
