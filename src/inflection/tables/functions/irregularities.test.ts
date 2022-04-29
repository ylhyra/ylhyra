import assert from "assert";
import { getWordFromServerForTesting } from "inflection/test/getWordFromServerForTesting";

/*
Wikipedia: „Óreglulega beygingu hafa sex sterk karlkynsorð; faðir, bróðir, vetur, fótur, fingur og maður. Nokkur sterk kvenkynsorð hafa einnig óreglulega beygingu; hönd, kýr, ær, sýr, mús, lús, móðir, dóttir, systir, mær (mey).“
https://vefir.mms.is/flettibaekur/namsefni/gullvor/28/

Ekki hér: orðstír (et.), mjólk (et.), dyr (ft.) buxur
*/
describe("Irregularities", () => {
  it("„bróðir“", (done) => {
    getWordFromServerForTesting(4385, done, (word) => {
      assert.equal(word.getIsWordIrregular(), true);
      assert.equal(
        word.get("genitive", "plural").getFirstValueRendered(),
        '<em class="irregular">br<span class="umlaut">æ</span>ðra</em>'
      );
      done();
    });
  });

  it("„ég eldist“", (done) => {
    getWordFromServerForTesting(434620, done, (word) => {
      assert.equal(word.getIsWordIrregular(), false);
      done();
    });
  });

  it("„systir“", (done) => {
    getWordFromServerForTesting(12258, done, (word) => {
      assert.equal(
        word.getFirstValueRendered(),
        '<em class="irregular">systir</em>'
      );
      assert.equal(
        word
          .get("dative", "plural", "with definite article")
          .getFirstValueRendered(),
        '<em class="irregular">systrunum</em>'
      );
      done();
    });
  });

  it("„farinn“", (done) => {
    getWordFromServerForTesting(390363, done, (word) => {
      assert.equal(
        word.get("neuter", "dative").getFirstValueRendered(),
        '<span class="elision">f<span class="umlaut">ö</span>rnu</span>'
      );
      done();
    });
  });

  it("„hér er á“", (done) => {
    getWordFromServerForTesting(390363, done, (word) => {
      assert.equal(word.getIsWordIrregular(), false);
      done();
    });
  });

  it("„sjá“", (done) => {
    getWordFromServerForTesting(466523, done, (word) => {
      assert.equal(
        word
          .get("mediopassive", "subjunctive", "past tense")
          .getFirstValueRendered(),
        's<span class="umlaut">æ</span>ist'
      );
      done();
    });
  });

  it("„hamar“", (done) => {
    getWordFromServerForTesting(471203, done, (word) => {
      assert.equal(word.getWordHasUmlaut(), true);
      assert.equal(
        word.get("dative").getFirstValueRendered(),
        '<span class="elision">hamri</span>'
      );
      assert.equal(
        word.get("dative", "with definite article").getFirstValueRendered(),
        '<span class="elision">hamrinum</span>'
      );
      assert.equal(
        word.get("dative", "plural").getFirstValueRendered(),
        '<span class="elision">h<span class="umlaut">ö</span>mrum</span>'
      );
      done();
    });
  });

  // frá himni

  it("„sykrið mitt“", (done) => {
    getWordFromServerForTesting(3700, done, (word) => {
      assert.equal(word.getWordHasUmlaut(), false);
      done();
    });
  });

  it("„að ausa“", (done) => {
    getWordFromServerForTesting(480329, done, (word) => {
      assert.equal(
        word.get("2nd person").getFirstValueRendered(),
        '<span class="umlaut">ey</span>st'
      );
      assert.equal(word.getIsWordIrregular(), false);
      done();
    });
  });
});
