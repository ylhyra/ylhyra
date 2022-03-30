"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const get_1 = require("inflection/test/get");
describe("Irregularities", function () {
    /*
    Wikipedia: „Óreglulega beygingu hafa sex sterk karlkynsorð; faðir, bróðir, vetur, fótur, fingur og maður. Nokkur sterk kvenkynsorð hafa einnig óreglulega beygingu; hönd, kýr, ær, sýr, mús, lús, móðir, dóttir, systir, mær (mey).“
    https://vefir.mms.is/flettibaekur/namsefni/gullvor/28/
  
    Test: orðstír (et.), mjólk (et.), dyr (ft.) buxur
    */
    it("„bróðir“", (done) => {
        (0, get_1.get)(4385, done, (word) => {
            assert_1.default.equal(word.getIsWordIrregular(), true);
            assert_1.default.equal(word.get("genitive", "plural").getFirstValueRendered(), '<em class="irregular">br<span class="umlaut">æ</span>ðra</em>');
            done();
        });
    });
    it("„systir“", (done) => {
        (0, get_1.get)(12258, done, (word) => {
            assert_1.default.equal(word.getFirstValueRendered(), '<em class="irregular">systir</em>');
            assert_1.default.equal(word
                .get("dative", "plural", "with definite article")
                .getFirstValueRendered(), '<em class="irregular">systrunum</em>');
            done();
        });
    });
    it("„farinn“", (done) => {
        (0, get_1.get)(390363, done, (word) => {
            assert_1.default.equal(word.get("neuter", "dative").getFirstValueRendered(), '<span class="elision">f<span class="umlaut">ö</span>rnu</span>');
            done();
        });
    });
    it("„hér er á“", (done) => {
        (0, get_1.get)(390363, done, (word) => {
            assert_1.default.equal(word.getIsWordIrregular(), false);
            done();
        });
    });
    it("„sjá“", (done) => {
        (0, get_1.get)(466523, done, (word) => {
            assert_1.default.equal(word
                .get("mediopassive", "subjunctive", "past tense")
                .getFirstValueRendered(), 's<span class="umlaut">æ</span>ist');
            done();
        });
    });
    it("„hamar“", (done) => {
        (0, get_1.get)(471203, done, (word) => {
            assert_1.default.equal(word.getWordHasUmlaut(), true);
            assert_1.default.equal(word.get("dative").getFirstValueRendered(), '<span class="elision">hamri</span>');
            assert_1.default.equal(word.get("dative", "with definite article").getFirstValueRendered(), '<span class="elision">hamrinum</span>');
            assert_1.default.equal(word.get("dative", "plural").getFirstValueRendered(), '<span class="elision">h<span class="umlaut">ö</span>mrum</span>');
            done();
        });
    });
    // frá himni
    it("„sykrið mitt“", (done) => {
        (0, get_1.get)(3700, done, (word) => {
            assert_1.default.equal(word.getWordHasUmlaut(), false);
            done();
        });
    });
    it("„að ausa“", (done) => {
        (0, get_1.get)(480329, done, (word) => {
            assert_1.default.equal(word.get("2nd person").getFirstValueRendered(), '<span class="umlaut">ey</span>st');
            assert_1.default.equal(word.getIsWordIrregular(), false);
            done();
        });
    });
});
