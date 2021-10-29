import {
  removeLastVowelCluster,
  splitOnVowelRegions,
} from "inflection/tables/functions/vowels";
import assert from "assert";

it("splitOnVowelRegions", () => {
  assert.deepEqual(splitOnVowelRegions("Kjartan"), ["K", "ja", "rt", "a", "n"]);
  assert.deepEqual(splitOnVowelRegions("andrés"), ["", "a", "ndr", "é", "s"]);
  return;
});
it("removeLastVowelCluster", () => {
  assert.equal(removeLastVowelCluster("syngja"), "syng");
  assert.equal(removeLastVowelCluster("já"), "j");
  assert.equal(removeLastVowelCluster("ja"), "");
  assert.equal(removeLastVowelCluster("Kjartan"), "Kjartan");
  return;
});
