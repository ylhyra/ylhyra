import {
  days,
  hours,
  minutes,
  prettyPrintDaysMinutesHours,
  seconds,
} from "app/app/functions/time";

test("prettyPrintDaysMinutesHours", () => {
  expect(prettyPrintDaysMinutesHours(12 * days + 10 * minutes)).toBe(
    "12 days, 10 minutes"
  );
  expect(
    prettyPrintDaysMinutesHours(2 * days + 23 * hours + 100 * seconds)
  ).toBe("2 days, 23 hours");
  expect(prettyPrintDaysMinutesHours(12 * hours + 10 * seconds)).toBe(
    "12 hours"
  );
});
