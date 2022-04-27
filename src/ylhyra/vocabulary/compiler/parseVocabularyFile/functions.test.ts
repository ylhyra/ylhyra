import { getHashForVocabulary } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";

test("getHash", () => {
  expect(getHashForVocabulary("Það er gott að búa á Íslandi.")).toBe("ue8guk");
  expect(getHashForVocabulary("Test?!; _(test)_ **test**")).toBe("gsut4n");
});
