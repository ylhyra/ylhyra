import { deck } from "app/Vocabulary/actions/deck";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";
import { updateURL } from "app/Router/actions";

export default () => {
  const tests = {
    "Sign up and discard progress": () => {
      updateURL();
    },
  };
};
