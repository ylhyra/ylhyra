/* Match the "%" in lemmas, which serves to mark something as both the basic form and an alt_id */
import _hash from "app/app/functions/hash";
import { isBrowser } from "app/app/functions/isBrowser";
import c from "app/app/functions/no-undefined-in-template-literal";
import { getUserFromCookie } from "app/user/actions";
import { ProcessLinks } from "documents/compile/functions/links";
import _ from "underscore";

/* Only used for testing */
export const getDeckName = () => {
  if (process.env.NODE_ENV === "development") {
    if (getUserFromCookie()?.username === "danska") {
      return "_da";
    }
    if (getUserFromCookie()?.username === "spænska") {
      return "_es";
    }
    if (getUserFromCookie()?.username === "norska") {
      return "_no";
    }
  }
  return "";
};

export const getPlaintextFromVocabularyEntry = (input) => {
  if (!input) return null;
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
};
export const getPlaintextFromFormatted = (input) => {
  if (!input) return null;
  return removeWhitespace(
    input
      .replace(/<span class="seperator">,<\/span>/g, ";")
      .replace(/<span class="seperator">;<\/span>/g, ";;")
      .replace(/<\/li><li>/g, ";; ")
      .replace(/<.+?>/g, "")
      .replace(/[—–]/g, "-")
      .replace(/  +/g, " ")
  );
};
export const removeWhitespace = (input) => {
  if (!input) return "";
  return input.replace(/[\s]+/g, " ").trim();
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  if (typeof input !== "string") {
    return input.toString();
  }
  input = automaticThu(input)
    .replace(/^- /g, "")
    .replace(/∆/g, ",")
    .replace(/\b(mig|þig|hann|hana) (langar)\b/gi, "^^$1^^ ^^$2^^")
    .replace(/\b(langar) (mig|þig|hann|hana)\b/gi, "^^$1^^ ^^$2^^")
    .replace(/\^\^([^^])([^^]+?)?\^\^/g, "$1*$2*")

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
    .replace(/{{prefix\|(.*?)}}/g, `<span class="helper-prefix">$1</span>`)
    .replace(
      /\(n(?:ote)?: (.*?)\)/g,
      `<small class="gray inline-note">(<i>$1</i>)</small>`
    )
    .replace(/'''(.+?)'''/g, "<b>$1</b>")
    .replace(/''(.+?)''/g, "<i>$1</i>")
    .replace(
      /( )?\*([^*;$!.,]+)\*?( )?/g,
      (x, space_before, text, space_after) => {
        return c`${space_before}<span class="occluded ${
          space_before && "space_before"
        }  ${
          space_after && "space_after"
        }"><span>${text}</span></span>${space_after}`;
      }
    )
    .replace(/[$%]([^ .!?;:]+)/g, (x, text) => {
      return c`<span class="occluded"><span>${text}</span></span>`;
    })
    .replace(/ [-–] /g, ` <span class="gray">–</span> `)
    .replace(/;;+/g, `MAJOR_SEPERATOR`)
    .replace(/;/g, `<span class="seperator">,</span>`)
    // .replace(/MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    // .replace(/(.+)MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    .replace(/'/g, "’")
    .replace(
      /{{p(?:ron)?\|(.+?)}}/g,
      `<span className="pron">[<span>$1</span>]</span>`
    )
    .replace(/{{small\|(.+?)}}/g, `<small>$1</small>`)
    .replace(/{{kk}}/g, `<sup>(masculine)</sup>`)
    .replace(/{{kvk}}/g, `<sup>(feminine)</sup>`)
    .replace(/{{hv?k}}/g, `<sup>(neuter)</sup>`)
    .replace(/{{bhet}}/g, `Speaking to one person`)
    .replace(/{{bhft}}/g, `Speaking to a group`)
    .replace(/{{ft}}/g, `<sup>(plural)</sup>`)
    .trim();

  if (/MAJOR_SEPERATOR/.test(input)) {
    input = `<ol>${input
      .split(/MAJOR_SEPERATOR ?/)
      .map((i) => `<li>${i}</li>`)
      .join("")}</ol>`;
  }

  if (/{{/.test(input)) {
    console.warn(`Unprocessed template: ${input.match(/({{.+?}})/)[1]}`);
  }

  input = ProcessLinks(input);
  return input;
};

const formatPrefixes = (first, second) => {
  // return first;
  if (!first || !second) return first;
  const re = /(^| - )(hér eru?|um|frá|til|here is|here are|about|from|to)( )/g;
  if (first.match(re) && second.match(re)) {
    // return first.replace(re, `$1{{prefix|$2}}$3`);
  }
  return first;
};

const formatLemmas = (input) => {
  if (!input) return "";
  input = formatVocabularyEntry(input)
    .replace(/%/g, "")
    .replace(/,/g, `<span class="seperator">,</span>`)
    .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
  return input;
};

export const GetLowercaseStringForAudioKey = (i) => {
  const string = getPlaintextFromVocabularyEntry(i)
    .replace(/[.]+$/, "")
    .toLowerCase();
  return string;
};

export const getHash = (input, options) => {
  if (!input) return null;
  if (Array.isArray(input)) {
    return getHash(input.map(getPlaintextFromVocabularyEntry).join(";"));
  }
  const string = getPlaintextFromVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return null;
  // return string;
  if (
    options?.skip_hash ||
    (isBrowser && (window.skip_hash || window.location.pathname === "/maker"))
  ) {
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
  "lemmas",
  "depends_on",
  "alternative_id",
  "level",
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
  "example_declension",
  "athugasemd_til_min",
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
      obj[id] = _.uniq([...(obj[id] || []), ...second]).filter((j) => j !== id);
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
      let alternative_ids = getHashesFromCommaSeperated(row.alternative_id);
      let depends_on_lemmas = [];
      const depends_on = [
        ...getHashesFromCommaSeperated(row.depends_on?.replace(/%/g, "")),
        ...getHashesFromCommaSeperated(depends_on_lemmas),
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
          to_add.push({
            is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
            is_formatted: formatVocabularyEntry(
              formatPrefixes(row.icelandic, row.english)
            ),
            from: "is",
            id: getHash(row.icelandic) + "_is",
            spokenSentences: getSpokenSentences(row.icelandic),
            // sound: getSounds(row.icelandic),
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
          spokenSentences: getSpokenSentences(row.icelandic),
          // sound: getSounds(row.icelandic),
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
    card.is_plaintext.split(/ ?[,;-] ?/g).forEach((sentence) => {
      /* Notað til að bæta við strengjum sem eru splittaðir með bandstriki */
      const sentence_hash = getHash(sentence);
      if (!(sentence_hash in terms) && !(sentence_hash in alternative_ids)) {
        automatic_alt_ids[sentence_hash] = {
          terms: card.terms,
          score: 0,
        };
      }
      // if (sentence.match(/um þig/)) {
      //   console.log(sentence);
      // }

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
  // TODO: Sleppa þegar deps innihalda nú þegar þetta orð!
  for (let [key, card] of Object.entries(cards)) {
    card.is_plaintext.split(/[,;] ?/g).forEach((sentence) => {
      const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
      const min_len = 1;
      for (let i = 0; i + min_len <= split.length && i <= 5; i++) {
        for (let b = i + min_len; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");

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
const automaticThu = (input) => {
  return input
    .replace(/\b(ert)u\b/gi, "$1{{u}}")
    .replace(/\b(ætlar)ðu\b/gi, "$1{{ðu}}");
};