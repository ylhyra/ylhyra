import { testHelper } from "modules/tests/testHelper";
import {
  days,
  hours,
  minutes,
  prettyPrintDaysMinutesHours,
  seconds,
} from "modules/time";

testHelper(prettyPrintDaysMinutesHours, [
  [
    prettyPrintDaysMinutesHours(12 * days + 10 * minutes),
    "12 days, 10 minutes",
  ],
  [
    prettyPrintDaysMinutesHours(2 * days + 23 * hours + 100 * seconds),
    "2 days, 23 hours",
  ],
  [prettyPrintDaysMinutesHours(12 * hours + 10 * seconds), "12 hours"],
]);
