import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/app/functions/localStorage";
import { updateURL } from "app/router/actions";
import axios from "app/app/axios";
import { deck } from "app/vocabulary/actions/deck";
import _ from "underscore";

export const MIN_PRICE = 2;
export const MAX_PRICE = 200;
export const continueAfterPaying = async ({ price, transaction_id }) => {
  const response = (
    await axios.post("/api/pwyw", {
      price,
      transaction_id,
    })
  ).data;
  updateURL("/");
  /* TODO: "Thank you" */
};

export const parsePrice = (price) => {
  price = price
    .toString()
    .replace(/\s/g, "")
    .replace(/\$/g, "")
    .replace(/,([0-9]{1,2})$/, ".$1")
    .replace(/,/, "");
  price = price || "0";
  if (/[^0-9.]/.test(price) || price.split(".").length > 2) {
    return { error: "INVALID_NUMBER" };
  }
  const [d, c] = price.split(".");
  const cents =
    parseInt(d) * 100 +
    (c ? Math.floor((parseInt(c) / 10 ** c.length) * 100) : 0);
  if (cents > MAX_PRICE * 100) {
    return { error: "TOO_LARGE" };
  }
  if (cents < MIN_PRICE * 100) {
    return { error: "TOO_SMALL" };
  }
  return (cents / 100).toFixed(2);
};
