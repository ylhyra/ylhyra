import { InitializeVocabulary } from "app/vocabulary/actions/initialize";
import { getCardByText } from "app/vocabulary/actions/card/functions";

beforeAll(async () => {
  await InitializeVocabulary();
});

test("siblings", () => {
  const card1 = getCardByText("ég er");
  expect(card1.getSiblingCards().length).toBe(1);
  expect(card1.getSiblingCards()[0].printWord()).toBe("I am");
});

test("isTextSimilarTo", () => {
  const card1 = getCardByText("Gaman að sjá þig."); // Nice to see you.
  const card2 = getCardByText("Það er gott að búa á Íslandi."); // It is nice ...
  console.log(card1.simplifiedArrayOfWords);
  expect(card1.isTextSimilarTo(card2)).toBe(true);
});
