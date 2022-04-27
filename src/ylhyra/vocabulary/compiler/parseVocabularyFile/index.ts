import _ from "underscore";
import { SortKeys } from "ylhyra/vocabulary/compiler/compiler.server/sortKeys.server";
import {
  formatLemmas,
  formatPrefixes,
  formatVocabularyEntry,
} from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/format";
import {
  automaticThuForCommonWords,
  getPlaintextFromUnformattedVocabularyEntry,
} from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/functions";
import {
  getHashesFromCommaSeperated,
  getHashForVocabulary,
} from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import {
  CardData,
  CardId,
  CardsInCompilationStep,
  Dependencies,
  TermId,
  TermIds,
  Terms,
  VocabularyFile,
} from "ylhyra/vocabulary/types";

export const parseVocabularyFile = (
  { rows, sound }: VocabularyFile,
  sortKeys?: SortKeys
) => {
  let terms: Terms = {};
  let dependencies: Dependencies = {};
  let alternativeIds: typeof dependencies = {};
  let plaintextSentences: { [id: string]: boolean } = {};
  let cards: CardsInCompilationStep = {};

  const TermsToCardId = (_terms: TermIds, id: CardId) => {
    _terms.forEach((term) => {
      if (!terms[term]) {
        terms[term] = {
          // userLevel: null,
          cards: [],
        };
      }
      terms[term].cards.push(id);
    });
  };

  const AddToDependencyGraph = (
    first: TermIds,
    second: TermIds,
    type?: "alt_ids"
  ) => {
    if (!second || second.length === 0) return;
    let obj = dependencies;
    if (type === "alt_ids") {
      obj = alternativeIds;
    }
    first.forEach((id) => {
      obj[id] = _.uniq([...(obj[id] || []), ...second]).filter((j) => j !== id);
      if (obj[id].length === 0) {
        delete obj[id];
      }
    });
  };

  const getSpokenSentences = (input: string) => {
    let output: string[] = [];
    input.split(/;+/g).forEach((i) => {
      getPlaintextFromUnformattedVocabularyEntry(i)
        .split(/ [-–—] /g)
        .forEach((j: string) => {
          output.push(j);
        });
    });
    return output;
  };

  _.shuffle(rows)
    .sort((a, b) => (a.level || 100) - (b.level || 100))
    .forEach((row) => {
      if (!row.icelandic) return;
      let toAdd: CardDataInCompilationStep[] = [];

      /* Can have multiple */
      let icelandicStrings = row.icelandic.split(/;+/g);
      let formattedIcelandicStrings = icelandicStrings.map(
        formatVocabularyEntry
      );
      const termsInThisLine = icelandicStrings.map((i) =>
        getHashForVocabulary(i)
      ) as TermIds;

      let altIdLemmas: string[] = [];
      let dependsOnLemmas: string[] = [];
      /** See {@link VocabularyFileEntry -> lemmas} for formatting syntax */
      row.lemmas?.split(/[,;]/g).forEach((lemma: string) => {
        if (/%%/.test(lemma)) {
          return;
        } else if (/%/.test(lemma)) {
          // @ts-ignore
          altIdLemmas.push(lemma.replaceAll("%", ""));
        } else {
          dependsOnLemmas.push(lemma);
        }
      });

      let alternativeIds = [
        ...getHashesFromCommaSeperated(row.alternative_id),
        ...altIdLemmas.map((i) => getHashForVocabulary(i)),
      ];

      /** See {@link VocabularyFileEntry -> depends_on} */
      const dependsOn: TermIds = [
        ...getHashesFromCommaSeperated(row.depends_on?.replace(/%/g, "")),
        ...dependsOnLemmas.map((i) => getHashForVocabulary(i)),
        ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
      ];

      AddToDependencyGraph(termsInThisLine, dependsOn);
      AddToDependencyGraph(alternativeIds, termsInThisLine, "alt_ids");

      if (row.direction && row.direction !== "<-" && row.direction !== "->") {
        throw new Error(`Unknown direction ${row.direction}`);
      }

      icelandicStrings.forEach((t: string) => {
        const s = getPlaintextFromUnformattedVocabularyEntry(t);
        s.split(/ [-–—] /g).forEach((k: string) => {
          plaintextSentences[k] = true;
        });
      });

      let cardSkeleton: Partial<CardDataInCompilationStep> = {
        en_plaintext: getPlaintextFromUnformattedVocabularyEntry(row.english),
        en_formatted: formatVocabularyEntry(
          formatPrefixes(row.english, row.icelandic)
        ),
        terms: termsInThisLine,
        level: row.level,
        pronunciation: row.pronunciation,
        lemmas: formatLemmas(row.lemmas),
        note_regarding_english: formatVocabularyEntry(
          row.note_regarding_english
        ),
        note: formatVocabularyEntry(row.note),
        literally: formatVocabularyEntry(row.literally),
        row_id: row.row_id,
        example_declension: row.example_declension,
        importance: row.importance,
        difficulty: row.difficulty,
        synonyms: row.synonyms,

        /** Used in backend */
        should_teach: row.should_teach,
        fix: row.fix,
        eyða: row.eyða,
      } as const;

      /** {@see DocumentationRegardingThuMerging} */
      if (/{{(ð?u)}}/.test(automaticThuForCommonWords(row.icelandic))) {
        const [, full, verb] = automaticThuForCommonWords(row.icelandic).match(
          /(([^ "„,.]+){{ð?u}})/
        ) as string[];
        cardSkeleton.note =
          cardSkeleton.note +
          " " +
          formatVocabularyEntry(`
        ''${full.toLowerCase()}'' is made by combining ''${verb.toLowerCase()}'' + ''þú''.
      `);
      }

      /* Icelandic to English */
      if (row.direction !== "<-") {
        /** TODO? What to do about this? */
        if (row.should_split === "yes") {
          icelandicStrings.forEach((i: string, index: number) => {
            toAdd.push({
              is_plaintext: getPlaintextFromUnformattedVocabularyEntry(i),
              is_formatted: formatPrefixes(
                formattedIcelandicStrings[index],
                row.english
              ),

              from: "is",
              id: getHashForVocabulary(i) + "_is",
              spokenSentences: getSpokenSentences(i),
              // sound: getSounds(i),
              ...cardSkeleton,
            } as CardDataInCompilationStep);
          });
        } else {
          toAdd.push({
            is_plaintext: getPlaintextFromUnformattedVocabularyEntry(
              row.icelandic
            ),
            is_formatted: formatVocabularyEntry(
              formatPrefixes(row.icelandic, row.english)
            ),
            from: "is",
            id: getHashForVocabulary(row.icelandic) + "_is",
            spokenSentences: getSpokenSentences(row.icelandic),
            ...cardSkeleton,
          } as CardDataInCompilationStep);
        }
      }

      /* English to Icelandic */
      if (row.direction !== "->") {
        toAdd.push({
          is_plaintext: getPlaintextFromUnformattedVocabularyEntry(
            row.icelandic
          ),
          is_formatted: formatVocabularyEntry(row.icelandic),
          from: "en",
          id: getHashForVocabulary(row.icelandic) + "_en",
          spokenSentences: getSpokenSentences(row.icelandic),
          ...cardSkeleton,
        } as CardDataInCompilationStep);
      }

      toAdd.forEach((card) => {
        if (cards[card.id])
          return console.log(`"${row.icelandic}" already exists`);
        TermsToCardId(termsInThisLine, card.id);
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
  const isPrefix = new RegExp(
    `^(${prefixes.map((i) => i[0]).join("|")}) `,
    "i"
  );
  const enPrefix = new RegExp(`${prefixes.map((i) => i[1]).join("|")} `, "i");
  let automaticAltIds: {
    [key: TermId]: {
      terms: TermIds;
      score: number;
    };
  } = {};
  for (let [, card] of Object.entries(cards)) {
    if (!card.en_plaintext) continue;

    /* Sleppa sjálfvirku á allra fyrstu orðunum í listanum */
    if (
      sortKeys &&
      card.terms.some((term) => sortKeys[term] && sortKeys[term] < 20)
    ) {
      // console.log(card.en_plaintext + " hætt við vegna lágs sortkeys");
      continue;
    }

    card.is_plaintext!.split(/ ?[,;-] ?/g).forEach((sentence) => {
      /* Notað til að bæta við strengjum sem eru splittaðir með bandstriki */
      const termId: TermId = getHashForVocabulary(sentence) as TermId;
      if (!(termId in terms) && !(termId in alternativeIds)) {
        automaticAltIds[termId] = {
          terms: card.terms,
          score: 0,
        };
        // if (sentence.match(/frá sér/)) {
        //   console.log(sentence);
        // }
      }

      /* Prefixar */
      if (sentence.match(isPrefix) && card.en_plaintext!.match(enPrefix)) {
        const without = sentence.replace(isPrefix, "");
        const score = prefixes
          .map((i) => i[0])
          .indexOf((sentence.match(isPrefix)?.[1] as string).toLowerCase());
        const termId: TermId = getHashForVocabulary(without) as TermId;
        if (
          termId in terms ||
          termId in alternativeIds ||
          (termId in automaticAltIds &&
            automaticAltIds[termId].score < score) ||
          ["að"].includes(without)
        )
          return;
        automaticAltIds[termId] = {
          terms: card.terms,
          score: score,
        };
      }
    });
  }

  /* TODO: Spaghetti code */
  let automaticAltIds2: {
    [key: TermId]: TermIds;
  } = {};
  let i: TermId;
  for (i in automaticAltIds) {
    automaticAltIds2[i] = automaticAltIds[i].terms;
    alternativeIds[i] = automaticAltIds[i].terms;
  }

  /* Automatic dependency graphs */
  const ignoredAutomaticWords = [
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
  for (let [, card] of Object.entries(cards)) {
    card.is_plaintext!.split(/[,;] ?/g).forEach((sentence) => {
      const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
      const minLen = 1;
      for (let i = 0; i + minLen <= split.length && i <= 5; i++) {
        for (let b = i + minLen; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");

          if (ignoredAutomaticWords.includes(range.toLowerCase())) {
            continue;
          }

          const hash = getHashForVocabulary(range) as TermId;
          const termIds = [
            hash,
            ...(alternativeIds[hash] || []),
            ...(automaticAltIds2[hash] || []),
          ];

          termIds.forEach((term_id) => {
            let term = terms[term_id];
            if (term) {
              if (
                term.cards.some((cardId) => cards[cardId].level <= card.level)
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
    alternativeIds: alternativeIds,
    plaintext_sentences: plaintextSentences,
    cards,
    sound,
  };
};
