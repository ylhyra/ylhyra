import assert from "assert";
import { getWordFromServerForTesting } from "inflection/test/getWordFromServerForTesting";
import { stripHtml } from "modules/stripHtml";

/*
Other words that might be interesting:
- dró
*/

describe("General word tests", () => {
  it("„farinn“", (done) => {
    getWordFromServerForTesting(390363, done, (word) => {
      assert.equal(word.get("weak declension").getFirstValue(), "farni");
      assert.equal(word.getFirst().is("masculine"), true);
      assert.equal(word.getFirst().is("neuter"), false);
      // assert.equal(word.getFirst().is('inexistent classification :)'), false)
      assert.equal(word.getType("word_class"), "adjective");
      assert.equal(word.getFirst().getType("plurality"), "singular");
      assert.equal(word.getId(), 390363);
      done();
    });
  });

  it("„Björn“", (done) => {
    getWordFromServerForTesting(353885, done, (word) => {
      /* Test that both variants were returned */
      assert.deepEqual(word.get("genitive").renderWithoutHelperWords(), [
        "Björns",
        'B<span class="umlaut">ja</span>rnar',
      ]);
      done();
    });
  });

  it("„sjár“", (done) => {
    getWordFromServerForTesting(5198, done, (word) => {
      assert.equal(word.getWordHasUmlaut(), false);
      done();
    });
  });

  it("„muna“ (ópersónulegt)", (done) => {
    getWordFromServerForTesting(428183, done, (word) => {
      // console.time('someFunction')
      assert.equal(
        stripHtml(word.getPrincipalParts()),
        "að muna, mig munaði (í gær), mig hefur munað"
      );
      assert.equal(word.isStrong(), false);
      assert.equal(word.getIsWordIrregular(), false);
      assert.equal(word.getWordHasUmlaut(), false);
      // console.timeEnd('someFunction')

      done();
    });
  });

  it("„fara“", (done) => {
    getWordFromServerForTesting(433568, done, (word) => {
      /* Test principal part generation from other than first */
      assert.equal(
        stripHtml(word.get("past").getPrincipalParts()),
        "að fara, ég fór (í gær), við fórum (í gær), ég hef farið"
      );
      assert.equal(word.isStrong(), true);
      done();
    });
  });
});
