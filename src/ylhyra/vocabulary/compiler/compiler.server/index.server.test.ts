import { getCardIdByText } from "ylhyra/vocabulary/app/actions/card/functions";
import { initializeVocabulary } from "ylhyra/vocabulary/app/actions/initialize";

beforeAll(async () => {
  await initializeVocabulary();
});

test("Check that cards marked for deletion are actually deleted", () => {
  expect(() => getCardIdByText("Er vikan þín búin að vera góð?")).toThrow();
});
