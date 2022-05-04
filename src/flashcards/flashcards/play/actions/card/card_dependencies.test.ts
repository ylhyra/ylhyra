import { hasDependenciesInCommonWith } from "ylhyra/vocabulary/app/actions/card/card_dependencies";
import { getCardIdByText } from "ylhyra/vocabulary/app/actions/card/functions";
import { initializeVocabulary } from "ylhyra/vocabulary/app/actions/initialize";

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
