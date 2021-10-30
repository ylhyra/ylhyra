import _ from "underscore";
import {
  formatLemmas,
  formatPrefixes,
  formatVocabularyEntry,
  getPlaintextFromVocabularyEntry,
} from "maker/vocabulary_maker/compile/format";
import {
  automaticThu,
  getHash,
  getHashesFromCommaSeperated,
} from "maker/vocabulary_maker/compile/functions";

export const parse_vocabulary_file = ({ rows, sound }, sortKeys) => {
  let terms = {};
  let dependencies = {};
  let alternative_ids = {};
  let plaintext_sentences = [];
  let cards = {};

  const TermsToCardId = (_terms, id) => {
    _terms.forEach((term) => {
      if (!terms[term]) {
        terms[term] = {
          // level: null,
          cards: [],
        };
      }
      terms[term].cards.push(id);
    });
  };
  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = dependencies;
    if (type === "alt_ids") {
      obj = alternative_ids;
    }
    first.forEach((id) => {
      obj[id] = _.uniq([...(obj[id] || []), ...second]).filter((j) => j !== id);
      if (obj[id].length === 0) {
        delete obj[id];
      }
    });
  };

  const getSpokenSentences = (input) => {
    let output = [];
    input.split(/;+/g).forEach((i) => {
      getPlaintextFromVocabularyEntry(i)
        .split(/ [-–—] /g)
        .forEach((j) => {
          output.push(j);
        });
    });
    return output;
  };

  // console.log(rows.length);

  _.shuffle(rows)
    .sort((a, b) => (a.level || 100) - (b.level || 100))
    .forEach((row) => {
      if (!row.icelandic) return;
      let to_add = [];

      /* Can have multiple */
      let icelandic_strings = row.icelandic.split(/;+/g);
      let formatted_icelandic_strings = icelandic_strings.map(
        formatVocabularyEntry
      );
      const terms_in_this_line = icelandic_strings.map(getHash);

      let altid_lemmas = [];
      let dependson_lemmas = [];
      row.lemmas?.split(/[,;]/g).forEach((lemma) => {
        if (/%%/.test(lemma)) {
          return;
        } else if (/%/.test(lemma)) {
          altid_lemmas.push(lemma.replaceAll("%", ""));
        } else {
          dependson_lemmas.push(lemma);
        }
      });

      let alternative_ids = [
        ...getHashesFromCommaSeperated(row.alternative_id),
        ...altid_lemmas.map(getHash),
      ];

      const depends_on = [
        ...getHashesFromCommaSeperated(row.depends_on?.replace(/%/g, "")),
        ...dependson_lemmas.map(getHash),
        ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
      ];

      AddToDependencyGraph(terms_in_this_line, depends_on);
      AddToDependencyGraph(alternative_ids, terms_in_this_line, "alt_ids");

      if (row.direction && row.direction !== "<-" && row.direction !== "->") {
        throw new Error(`Unknown direction ${row.direction}`);
      }

      icelandic_strings.forEach((t) => {
        const s = getPlaintextFromVocabularyEntry(t);
        s.split(/ [-–—] /g).forEach((t) => {
          plaintext_sentences[t] = true;
        });
      });

      /** @type CardData */
      let card_skeleton = {
        en_plaintext: getPlaintextFromVocabularyEntry(row.english),
        en_formatted: formatVocabularyEntry(
          formatPrefixes(row.english, row.icelandic)
        ),
        terms: terms_in_this_line,
        level: row.level,
        pronunciation: row.pronunciation,
        // sort: line_number,
        lemmas: formatLemmas(row.lemmas),
        note_regarding_english: formatVocabularyEntry(
          row.note_regarding_english
        ),
        note: formatVocabularyEntry(row.note),
        literally: formatVocabularyEntry(row.literally),
        row_id: row.row_id,
        example_declension: row.example_declension,
      };

      if (/{{(ð?u)}}/.test(automaticThu(row.icelandic))) {
        const [, full, verb] = automaticThu(row.icelandic).match(
          /(([^ "„,.]+){{(?:ð?u)}})/
        );
        card_skeleton.note =
          card_skeleton.note +
          " " +
          formatVocabularyEntry(`
        ''${full.toLowerCase()}'' is made by combining ''${verb.toLowerCase()}'' + ''þú''.
      `);
      }

      /* Icelandic to English */
      if (row.direction !== "<-") {
        if (row.should_split === "yes") {
          icelandic_strings.forEach((i, index) => {
            to_add.push({
              is_plaintext: getPlaintextFromVocabularyEntry(i),
              is_formatted: formatPrefixes(
                formatted_icelandic_strings[index],
                row.english
              ),

              from: "is",
              id: getHash(i) + "_is",
              spokenSentences: getSpokenSentences(i),
              // sound: getSounds(i),
              ...card_skeleton,
            });
          });
        } else {
          to_add.push(
            /** @type CardData */ {
              is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
              is_formatted: formatVocabularyEntry(
                formatPrefixes(row.icelandic, row.english)
              ),
              from: "is",
              id: getHash(row.icelandic) + "_is",
              spokenSentences: getSpokenSentences(row.icelandic),
              // sound: getSounds(row.icelandic),
              ...card_skeleton,
            }
          );
        }
      }

      /* English to Icelandic */
      if (row.direction !== "->") {
        to_add.push(
          /** @type CardData */ {
            is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
            is_formatted: formatVocabularyEntry(row.icelandic),
            from: "en",
            id: getHash(row.icelandic) + "_en",
            spokenSentences: getSpokenSentences(row.icelandic),
            // sound: getSounds(row.icelandic),
            ...card_skeleton,
          }
        );
      }

      to_add.forEach((card) => {
        if (cards[card.id])
          return console.log(`"${row.icelandic}" already exists`);
        TermsToCardId(terms_in_this_line, card.id);
        cards[card.id] = card;
      });
    });

  /* Automatic alt-ids */
  let prefixes = [
    ["hér er", "here is"],
    ["um", "about"],
    ["frá", "from"],
    ["til", "to"],
    ["að", "to"],
    ["ég", "I"],
    ["þú", "you"],
    ["hann er", "he is"],
    ["hún er", "she is"],
    ["það er", "it is"],
    ["það er", "that is"],
    ["hann", "he"],
    ["hún", "she"],
    ["það", "it"],
    ["það", "that"],
    ["við", "we"],
  ];
  const is_prefix = new RegExp(
    `^(${prefixes.map((i) => i[0]).join("|")}) `,
    "i"
  );
  const en_prefix = new RegExp(`${prefixes.map((i) => i[1]).join("|")} `, "i");
  let automatic_alt_ids = {};
  for (let [key, card] of Object.entries(cards)) {
    if (!card.en_plaintext) continue;

    /* Sleppa sjálfvirku á allra fyrstu orðunum í listanum */
    if (
      sortKeys &&
      card.terms.some((term) => sortKeys[term] && sortKeys[term] < 20)
    ) {
      // console.log(card.en_plaintext + " hætt við vegna lágs sortkeys");
      continue;
    }

    card.is_plaintext.split(/ ?[,;-] ?/g).forEach((sentence) => {
      /* Notað til að bæta við strengjum sem eru splittaðir með bandstriki */
      const sentence_hash = getHash(sentence);
      if (!(sentence_hash in terms) && !(sentence_hash in alternative_ids)) {
        automatic_alt_ids[sentence_hash] = {
          terms: card.terms,
          score: 0,
        };
        // if (sentence.match(/frá sér/)) {
        //   console.log(sentence);
        // }
      }

      /* Prefixar */
      if (sentence.match(is_prefix) && card.en_plaintext.match(en_prefix)) {
        const without = sentence.replace(is_prefix, "");
        const score = prefixes
          .map((i) => i[0])
          .indexOf(sentence.match(is_prefix)[1].toLowerCase());
        const hash = getHash(without);
        if (
          hash in terms ||
          hash in alternative_ids ||
          (hash in automatic_alt_ids &&
            automatic_alt_ids[hash].score < score) ||
          ["að"].includes(without)
        )
          return;
        automatic_alt_ids[hash] = {
          terms: card.terms,
          score: score,
        };
      }
    });
  }
  Object.keys(automatic_alt_ids).forEach((i) => {
    automatic_alt_ids[i] = automatic_alt_ids[i].terms;

    alternative_ids[i] = automatic_alt_ids[i].terms;
  });

  /* Automatic dependency graphs */
  const ignored_automatic_words = [
    "hér",
    "hér er",
    "um",
    "frá",
    "til",
    "hann",
    "hún",
    "það",
    "er",
    "ert",
    "ég",
    "eru",
    "að",
    "við",
    "hann er",
    "ég er",
    "þú ert",
    "hún er",
    "það er",
  ];
  // TODO: Sleppa þegar deps innihalda nú þegar þetta orð!
  for (let [key, card] of Object.entries(cards)) {
    card.is_plaintext.split(/[,;] ?/g).forEach((sentence) => {
      const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
      const min_len = 1;
      for (let i = 0; i + min_len <= split.length && i <= 5; i++) {
        for (let b = i + min_len; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");

          if (ignored_automatic_words.includes(range.toLowerCase())) {
            continue;
          }

          const hash = getHash(range);
          const term_ids = [
            hash,
            ...(alternative_ids[hash] || []),
            ...(automatic_alt_ids[hash] || []),
          ];

          term_ids.forEach((term_id) => {
            let term = terms[term_id];
            if (term) {
              if (
                term.cards.some((card_id) => cards[card_id].level <= card.level)
              ) {
                // if (sentence === "Þetta er mjög auðvelt.") {
                //   console.log(term_id);
                // }
                AddToDependencyGraph(card.terms, [term_id]);
              }
            }
          });
        }
      }
    });
  }

  // console.log(JSON.stringify(dependencies, null, 2).slice(0, 400));
  return {
    terms,
    dependencies,
    alternative_ids,
    plaintext_sentences,
    cards,
    sound,
  };
};
