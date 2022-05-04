import { hasDependenciesInCommonWith } from "flashcards/flashcards/play/actions/card/card_dependencies";
import { getCardIdByText } from "flashcards/flashcards/play/actions/card/functions";
import { initializeVocabulary } from "flashcards/flashcards/play/actions/initialize";

beforeAll(async () => {
  await initializeVocabulary();
});

test("hasDependenciesInCommonWith", () => {
  expect(
    hasDependenciesInCommonWith(
      getCardIdByText("Var vikan þín góð?"),
      getCardIdByText("Það er gott að búa á Íslandi.")
    )
  ).toBe(true);
});
