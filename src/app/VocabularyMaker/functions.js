import c from "app/App/functions/no-undefined-in-template-literal.js";
import _ from "underscore";
import _hash from "app/App/functions/hash";
import { isBrowser } from "app/App/functions/isBrowser";
import { URL_title, section_id } from "paths.js";
import { ProcessLinks } from "documents/Compile/functions.js";

export const getPlaintextFromVocabularyEntry = (input) => {
  if (!input) return null;
  return formatVocabularyEntry(input)
    .replace(/<.+?>/g, "")
    .replace(/[\s]+/g, " ")
    .trim();
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  if (typeof input !== "string") {
    return input.toString();
  }
  input = input
    .replace(/∆/g, ",")
    .replace(
      /{{spp}}/g,
      `This verb's form is the same in the past and the present tense.`
    )
    .replace(
      /"([^"]*)"/g,
      `<span class="darkgray">“</span>$1<span class="darkgray">”</span>`
    ) /* Curly quotes */
    .replace(
      / \+ /g,
      `\u2006<span class="darkgray">+</span>\u2006`
    ) /* Spacing around plusses */
    .replace(
      / \/ /g,
      `\u2006<span class="darkgray">/</span>\u2006`
    ) /* Spacing around "/" */
    .replace(/{{(ð?u)}}/g, `<span class="thu-merging">$1</span>`)
    .replace(/\^([^ .!?:;-]?)/g, `{{gray|$1}}`)
    .replace(/_(.+?)_/g, `{{gray|$1}}`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(
      /\(note: (.*?)\)/g,
      `<small class="gray inline-note">(<i>$1</i>)</small>`
    )
    .replace(/'''(.+?)'''/g, "<b>$1</b>")
    .replace(/''(.+?)''/g, "<i>$1</i>")
    .replace(/( )?\*(.+?)\*( )?/g, (x, space_before, text, space_after) => {
      return c`${space_before}<span class="occluded ${
        space_before && "space_before"
      }  ${
        space_after && "space_after"
      }"><span>${text}</span></span>${space_after}`;
    })
    .replace(/ [-–] /g, ` <span class="gray">—</span> `)
    .replace(/;;/g, `MAJOR_SEPERATOR`)
    .replace(/;/g, `<span class="seperator">,</span>`)
    .replace(/MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    .replace(/'/g, "’")
    .replace(
      /{{pron\|(.+?)}}/g,
      `<span className="pron">[<span>$1</span>]</span>`
    )
    .replace(/{{small\|(.+?)}}/g, `<small>$1</small>`)
    .replace(/{{kk}}/g, `<sup>(masculine)</sup>`)
    .replace(/{{kvk}}/g, `<sup>(feminine)</sup>`)
    .replace(/{{hv?k}}/g, `<sup>(neuter)</sup>`)
    .trim();

  if (/{{/.test(input)) {
    console.warn(`Unprocessed template: ${input.match(/({{.+?}})/)[1]}`);
  }

  input = ProcessLinks(input);
  return input;
};

const formatLemmas = (input) => {
  if (!input) return "";
  input = formatVocabularyEntry(input)
    .replace(/%/g, "")
    .replace(/,/g, `<span class="seperator">,</span>`)
    .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
  return input;
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
  if (isBrowser && window.skip_hash) {
    return string;
  }
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
  "level",
  "depends_on",
  "lemmas",
  "alternative_id",
  "dont_confuse",
  "related_items",
  "direction",
  "note",
  "note_regarding_english",
  // "note_bfr_show",
  // "note_after_show",
  // "note_after_show_is",
  "literally",
  "pronunciation",
  "should_teach",
  "categories",
  "grammar_tags",
  "importance",
  "show_hint",
  "should_split",
  "fix",
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
      obj[id] = [...(obj[id] || []), ...second];
    });
  };
  const getSounds = (input) => {
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
      let icelandic_strings = row.icelandic.split(/;+/g);
      let formatted_icelandic_strings = icelandic_strings.map(
        formatVocabularyEntry
      );
      const terms_in_this_line = icelandic_strings.map(getHash);
      let alternative_ids = getHashesFromCommaSeperated(row.alternative_id);
      /* Match the "%" in lemmas, which serves to mark something as both the basic form and an alt_id */
      const lemmas =
        row.lemmas &&
        row.lemmas.split(",").map((input) => {
          const out = input.replace(/\(".+?"\)/g, "").replace(/%/g, "");
          if (/%/.test(input)) {
            alternative_ids.push(getHash(out));
          }
          return out;
        });
      const depends_on = [
        ...getHashesFromCommaSeperated(row.depends_on),
        ...getHashesFromCommaSeperated(lemmas),
        ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
      ];

      AddToDependencyGraph(terms_in_this_line, depends_on);
      AddToDependencyGraph(alternative_ids, terms_in_this_line, "alt_ids");

      if (row.direction && row.direction !== "<-" && row.direction !== "->") {
        throw new Error(`Unknown direction ${row.direction}`);
      }

      icelandic_strings.forEach((t) => {
        plaintext_sentences[getPlaintextFromVocabularyEntry(t)] = true;
      });

      let card_skeleton = {
        en_plaintext: getPlaintextFromVocabularyEntry(row.english),
        en_formatted: formatVocabularyEntry(row.english),
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
      };

      if (/{{(ð?u)}}/.test(row.icelandic)) {
        const [x, full, verb] = row.icelandic.match(/(([^ "„,.]+){{(?:ð?u)}})/);
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
              is_formatted: formatted_icelandic_strings[index],
              from: "is",
              id: getHash(i) + "_is",
              sound: getSounds(i),
              ...card_skeleton,
            });
          });
        } else {
          to_add.push({
            is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
            is_formatted: formatVocabularyEntry(row.icelandic),
            from: "is",
            id: getHash(row.icelandic) + "_is",
            sound: getSounds(row.icelandic),
            ...card_skeleton,
          });
        }
      }

      /* English to Icelandic */
      if (row.direction !== "->") {
        to_add.push({
          is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
          is_formatted: formatVocabularyEntry(row.icelandic),
          from: "en",
          id: getHash(row.icelandic) + "_en",
          sound: getSounds(row.icelandic),
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

  /* Automatic dependency graphs */
  for (let [key, card] of Object.entries(cards)) {
    card.is_plaintext.split(/[,;] ?/g).forEach((sentence) => {
      const split = sentence.split(/ /g);
      const min_len = 2;
      for (let i = 0; i + min_len <= split.length && i <= 5; i++) {
        for (let b = i + min_len; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");
          const hash = getHash(range);
          const term = terms[hash];
          if (term) {
            if (term.cards.some((c) => c.level <= card.level)) {
              AddToDependencyGraph(card.terms, [hash]);
            }
          }
        }
      }
    });
  }
  // console.log(JSON.stringify(terms).slice(0, 100));
  return {
    terms,
    dependencies,
    alternative_ids,
    plaintext_sentences,
    cards,
  };
};
