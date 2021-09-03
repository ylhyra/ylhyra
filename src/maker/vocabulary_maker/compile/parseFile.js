import c from "app/app/functions/no-undefined-in-template-literal";
import { getUserFromCookie } from "app/user/actions";
import { ProcessLinks } from "documents/compile/functions/links";
import _ from "underscore";
import { getHash } from "./functions";
import { getPlaintextFromVocabularyEntry } from "maker/vocabulary_maker/functions";
import { formatVocabularyEntry } from "maker/vocabulary_maker/compile";

export function parse_vocabulary_file({ rows, sound }) {
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
      /* Match the "%" in lemmas, which serves to mark something as both the basic form and an alt_id */
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

  // Automatic alt-ids
  /* Automatic dependency graphs */
  // console.log(JSON.stringify(dependencies, null, 2).slice(0, 400));
  return {
    terms,
    dependencies,
    alternative_ids,
    plaintext_sentences,
    cards,
    sound,
  };
}
