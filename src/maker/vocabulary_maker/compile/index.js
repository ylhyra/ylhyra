import automaticAltIds from "src/maker/vocabulary_maker/compile/dependencies/automaticAltIds.js";
import automaticDependencies from "src/maker/vocabulary_maker/compile/dependencies/automaticDependencies.js";
import parse_vocabulary_file from "src/maker/vocabulary_maker/compile/parseFile.js";
import _ from "underscore";

let obj;

class WIPDeck {
  constructor() {
    this.terms = {};
    this.dependencies = {};
    this.alternative_ids = {};
    this.plaintext_sentences = [];
    this.cards = {};
    obj = this;
  }
  TermsToCardId(_terms, id) {
    _terms.forEach((term) => {
      if (!this.terms[term]) {
        this.terms[term] = {
          // level: null,
          cards: [],
        };
      }
      this.terms[term].cards.push(id);
    });
  }
  AddToDependencyGraph(first, second, type) {
    if (!second || second.length === 0) return;
    let obj = this.dependencies;
    if (type === "alt_ids") {
      obj = this.alternative_ids;
    }
    first.forEach((id) => {
      obj[id] = _.uniq([...(obj[id] || []), ...second]).filter((j) => j !== id);
      if (obj[id].length === 0) {
        delete obj[id];
      }
    });
  }
}
WIPDeck.prototype.automaticAltIds = automaticAltIds;
WIPDeck.prototype.automaticDependencies = automaticDependencies;
WIPDeck.prototype.parse_vocabulary_file = parse_vocabulary_file;

new WIPDeck();

export default obj;
