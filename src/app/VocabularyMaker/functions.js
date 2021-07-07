import _ from "underscore";
import _hash from "app/App/functions/hash";
import { isBrowser } from "app/App/functions/isBrowser";

export const getPlaintextFromVocabularyEntry = (input) => {
  if (!input) return null;
  return formatVocabularyEntry(input)
    .replace(/<.+?>/g, "")
    .replace(/[\s]+/g, " ")
    .trim();
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  return input
    .replace(/∆/g, ",")
    .replace(/{{(ð?u)}}/g, `<span class="thu-merging">$1</span>`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(/(\(note: .*?\))/g, `<small class="gray">$1</small>`)
    .replace(/'''(.+?)'''/g, "<b>$1</b>")
    .replace(/'(.+?)''/g, "<i>$1</i>")
    .replace(/\*(.+?)\*/g, `<span class="occluded">$1</span>`)
    .replace(/;;/g, `MAJOR_SEPERATOR`)
    .replace(/;/g, `<span class="seperator">,</span>`)
    .replace(/MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    .replace(/%/g, "");
};

export const clean_string = (i) => {
  return getPlaintextFromVocabularyEntry(i);
  // return i
  //   .replace(/;;/g, "MAJOR_SEPERATOR")
  //   .replace(/;/g, "MINOR_SEPERATOR")
  //   .replace(/∆/g, ",")
  //
  //   .replace(/\*/g, "")
  //   .replace(/\\,/g, ",")
  //   .replace(/'{2,}/g, "")
  //   .replace(/\s+/g, " ")
  //   .replace(/%/g, "")
  //   .trim();
};

export const GetLowercaseStringForAudioKey = (i) => {
  const string = clean_string(i).replace(/[.]+$/, "").toLowerCase();
  return string;
};

export const getHash = (i) => {
  if (Array.isArray(i)) {
    return getHash(i.map(clean_string).join(";"));
  }
  const string = clean_string(i)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return null;
  // return string; //TEMP
  return _hash(string);
};

export const getHashesFromCommaSeperated = (i) => {
  if (!i) return [];
  if (Array.isArray(i)) {
    return i.map(getHash);
  }
  return i.split(",").map(getHash).filter(Boolean);
};

export const row_titles = [
  // "icelandic",
  // "english",
  "depends_on",
  "basic_form",
  "this is a minor variation of",
  "level",
  "dont_confuse",
  "related_items",
  "direction",
  "note_bfr_show",
  "note_after_show",
  "note_after_show_is",
  "grammar_note f/icelandic",
  "literally",
  "pronunciation",
  "should_teach",
  "categories",
  "grammar_tags",
  "importance",
  "show_hint",
  "should_split",
  "alternative_id",
  "Laga?",
  "eyða",
];

export const parse_vocabulary_file = ({ rows, sound }) => {
  let terms = {};
  let dependencies = {};
  let alternative_ids = {};
  let plaintext_sentences = [];
  let cards = {};

  const TermsToCardId = (_terms, id) => {
    _terms.forEach((term) => {
      if (!terms[term]) {
        terms[term] = {
          level: null,
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
      obj[id] = [...(obj[id] || []), ...second];
    });
  };
  const getSound = (input) => {
    if (isBrowser) return;
    let output = [];
    input.split(/;+/g).forEach((i) => {
      /* a very slow comparison */
      let s = sound.filter(
        (k) =>
          GetLowercaseStringForAudioKey(k.recording_of) ===
          GetLowercaseStringForAudioKey(i)
      );
      output = output.concat(s);
    });
    if (output.length > 0) return output;
    return null;
  };
  // console.log(rows.length);

  _.shuffle(rows)
    .sort((a, b) => (a.level || 100) - (b.level || 100))
    .forEach((row) => {
      if (!row.icelandic) return;
      let to_add = [];

      /* Can have multiple */
      let plaintext_icelandic_strings = row.icelandic.split(/;+/g);
      // .map(getPlaintextFromVocabularyEntry);
      let formatted_icelandic_strings = row.icelandic
        .split(/;+/g)
        .map(formatVocabularyEntry);
      const terms_in_this_line = plaintext_icelandic_strings.map(getHash);
      let alternative_ids = getHashesFromCommaSeperated(row.alternative_id);
      /* Match the "%" in basic_form, which serves to mark something as both the basic form and an alt_id */
      const basic_form =
        row.basic_form &&
        row.basic_form.split(",").map((input) => {
          const out = input.replace(/\(".+?"\)/g, "").replace(/%/g, "");
          if (/%/.test(input)) {
            alternative_ids.push(getHash(out));
          }
          return out;
        });
      const depends_on = [
        ...getHashesFromCommaSeperated(row.depends_on),
        ...getHashesFromCommaSeperated(basic_form),
        ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
      ];

      AddToDependencyGraph(terms_in_this_line, depends_on);
      AddToDependencyGraph(alternative_ids, terms_in_this_line, "alt_ids");

      if (row.direction && row.direction !== "<-" && row.direction !== "->") {
        throw new Error(`Unknown direction ${row.direction}`);
      }

      plaintext_icelandic_strings.forEach((t) => {
        plaintext_sentences[getPlaintextFromVocabularyEntry(t)] = true;
      });

      let card_skeleton = {
        en: formatVocabularyEntry(row.english),
        terms: terms_in_this_line,
        level: row.level,
        // sort: line_number,
        basic_form: row.basic_form,
        note_bfr_show: row.note_bfr_show,
        note_after_show: row.note_after_show,
        literally: row.literally,
      };

      /* Icelandic to English */
      if (row.direction !== "<-") {
        plaintext_icelandic_strings.forEach((i, index) => {
          to_add.push({
            is: i,
            is_formatted: formatted_icelandic_strings[index],
            from: "is",
            id: getHash(i) + "_is",
            sound: getSound(i),
            ...card_skeleton,
          });
        });
      }

      /* English to Icelandic */
      if (row.direction !== "->") {
        to_add.push({
          is: getPlaintextFromVocabularyEntry(row.icelandic),
          is_formatted: formatVocabularyEntry(row.icelandic),
          from: "en",
          id: getHash(row.icelandic) + "_en",
          sound: getSound(row.icelandic),
          ...card_skeleton,
        });
      }

      to_add.forEach((card) => {
        if (cards[card.id])
          return console.log(`"${row.icelandic}" already exists`);
        TermsToCardId(terms_in_this_line, card.id);
        cards[card.id] = card;
      });
    });
  // console.log(JSON.stringify(terms).slice(0, 100));
  //
  return {
    terms,
    dependencies,
    alternative_ids,
    plaintext_sentences,
    cards,
  };
};
