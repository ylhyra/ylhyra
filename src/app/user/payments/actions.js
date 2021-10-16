import { updateURL } from "app/router/actions/updateURL";

export const MIN_PRICE = 3;
export const MAX_PRICE = 200;
export const continueAfterPaying = async () => {
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
