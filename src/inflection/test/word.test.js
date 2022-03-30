"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const link_1 = require("inflection/tables/link");
const get_1 = require("inflection/test/get");
/*
Other words that might be interesting:
- dró
*/
describe("General word tests", function () {
    it("„farinn“", (done) => {
        (0, get_1.get)(390363, done, (word) => {
            assert_1.default.equal(word.get("weak declension").getFirstValue(), "farni");
            assert_1.default.equal(word.getFirst().is("masculine"), true);
            assert_1.default.equal(word.getFirst().is("neuter"), false);
            // assert.equal(word.getFirst().is('inexistent classification :)'), false)
            assert_1.default.equal(word.getType("class"), "adjective");
            assert_1.default.equal(word.getFirst().getType("plurality"), "singular");
            assert_1.default.equal(word.getId(), 390363);
            done();
        });
    });
    it("„Björn“", (done) => {
        (0, get_1.get)(353885, done, (word) => {
            /* Test that both variants were returned */
            assert_1.default.deepEqual(word.get("genitive").renderForms(), [
                "Björns",
                'B<span class="umlaut">ja</span>rnar',
            ]);
            done();
        });
    });
    it("„sjár“", (done) => {
        (0, get_1.get)(5198, done, (word) => {
            assert_1.default.equal(word.getWordHasUmlaut(), false);
            done();
        });
    });
    it("„muna“", (done) => {
        (0, get_1.get)(428183, done, (word) => {
            // console.time('someFunction')
            assert_1.default.equal((0, link_1.stripHTML)(word.getPrincipalParts()), "að muna, mig munaði (í gær), ég hef munað");
            assert_1.default.equal(word.isStrong(), false);
            assert_1.default.equal(word.getIsWordIrregular(), false);
            assert_1.default.equal(word.getWordHasUmlaut(), false);
            // console.timeEnd('someFunction')
            done();
        });
    });
    it("„fara“", (done) => {
        (0, get_1.get)(433568, done, (word) => {
            /* Test principal part generation from other than first */
            assert_1.default.equal((0, link_1.stripHTML)(word.get("past").getPrincipalParts()), "að fara, ég fór (í gær), við fórum (í gær), ég hef farið");
            assert_1.default.equal(word.isStrong(), true);
            done();
        });
    });
    // it.only('Junk data', () => {
    //   assert.throws(new Word(['ok']), Error)
    //   return
    // })
});
