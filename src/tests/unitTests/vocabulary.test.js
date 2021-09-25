import { InitializeVocabulary } from "app/vocabulary/actions/initialize";
import { getCardByText } from "app/vocabulary/actions/card/functions";
const console = require("console");

beforeAll(async () => {
  // global.console = require("console");
  await InitializeVocabulary();
});

test("siblings", () => {
  const card1 = getCardByText("ég er");
  expect(card1.getSiblingCards().length).toBe(1);
  expect(card1.getSiblingCards()[0].printWord()).toBe("I am");
});

test("isTextSimilarTo", () => {
  const card1 = getCardByText("Gaman að sjá þig."); // Nice to see you.
  console.warn(card1.phoneticHashArray);
  expect(card1.phoneticHashArray).not.toBeFalsy();
  const card2 = getCardByText("Það er gott að búa á Íslandi."); // It is nice ...
  expect(card1.isTextSimilarTo(card2)).toBe(true);
});
