import { testSimpleInputOutput } from "modules/tests/testHelper";
import {
  days,
  hours,
  minutes,
  prettyPrintDaysMinutesHours,
  seconds,
} from "modules/time";

testSimpleInputOutput(prettyPrintDaysMinutesHours, [
  { input: 12 * days + 10 * minutes, output: "12 days, 10 minutes" },
  { input: 2 * days + 23 * hours + 100 * seconds, output: "2 days, 23 hours" },
  { input: 12 * hours + 10 * seconds, output: "12 hours" },
]);
