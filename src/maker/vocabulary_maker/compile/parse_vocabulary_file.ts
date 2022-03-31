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
import _ from "underscore";

export type CardData = {
  en_plaintext: string;
  en_formatted: string;
  terms: string[];
  level: string;
  pronunciation?: string;
  lemmas?: string;
  note_regarding_english?: string;
  note?: string;
  literally?: string;
  row_id: string;
  example_declension?: string;
  importance?: string;
  difficulty?: string;
  synonyms?: string;
  is_plaintext: string;
  is_formatted: string;
  from: string;
  id: string;
  spokenSentences?: string[];
};

export const parseVocabularyFile = ({ rows, sound }, sortKeys) => {
  let terms: { [id: string]: { cards: string[] } } = {};
  let dependencies: { [id: string]: string[] } = {};
  let alternativeIds: typeof dependencies = {};
  let plaintextSentences: { [id: string]: boolean } = {};
  let cards: { [key: string]: CardData } = {};

  const TermsToCardId = (_terms: string[], id: string) => {
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
    first: string[],
    second: string[],
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
      getPlaintextFromVocabularyEntry(i)
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
      let toAdd: CardData[] = [];

      /* Can have multiple */
      let icelandicStrings = row.icelandic.split(/;+/g);
      let formattedIcelandicStrings = icelandicStrings.map(
        formatVocabularyEntry
      );
      const termsInThisLine = icelandicStrings.map(getHash);

      let altIdLemmas: string[] = [];
      let dependsOnLemmas: string[] = [];
      row.lemmas?.split(/[,;]/g).forEach((lemma: string) => {
        if (/%%/.test(lemma)) {
          return;
        } else if (/%/.test(lemma)) {
          altIdLemmas.push(lemma.replaceAll("%", ""));
        } else {
          dependsOnLemmas.push(lemma);
        }
      });

      let alternativeIds = [
        ...getHashesFromCommaSeperated(row.alternative_id),
        ...altIdLemmas.map(getHash),
      ];

      const dependsOn = [
        ...getHashesFromCommaSeperated(row.depends_on?.replace(/%/g, "")),
        ...dependsOnLemmas.map(getHash),
        ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
      ];

      AddToDependencyGraph(termsInThisLine, dependsOn);
      AddToDependencyGraph(alternativeIds, termsInThisLine, "alt_ids");

      if (row.direction && row.direction !== "<-" && row.direction !== "->") {
        throw new Error(`Unknown direction ${row.direction}`);
      }

      icelandicStrings.forEach((t: string) => {
        const s = getPlaintextFromVocabularyEntry(t);
        s.split(/ [-–—] /g).forEach((k: string) => {
          plaintextSentences[k] = true;
        });
      });

      let cardSkeleton: Partial<CardData> = {
        en_plaintext: getPlaintextFromVocabularyEntry(row.english),
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
      } as const;

      if (/{{(ð?u)}}/.test(automaticThu(row.icelandic))) {
        const [, full, verb] = automaticThu(row.icelandic).match(
          /(([^ "„,.]+){{ð?u}})/
        );
        cardSkeleton.note =
          cardSkeleton.note +
          " " +
          formatVocabularyEntry(`
        ''${full.toLowerCase()}'' is made by combining ''${verb.toLowerCase()}'' + ''þú''.
      `);
      }

      /* Icelandic to English */
      if (row.direction !== "<-") {
        if (row.should_split === "yes") {
          icelandicStrings.forEach((i: string, index: number) => {
            toAdd.push({
              is_plaintext: getPlaintextFromVocabularyEntry(i),
              is_formatted: formatPrefixes(
                formattedIcelandicStrings[index],
                row.english
              ),

              from: "is",
              id: getHash(i) + "_is",
              spokenSentences: getSpokenSentences(i),
              // sound: getSounds(i),
              ...cardSkeleton,
            } as CardData);
          });
        } else {
          toAdd.push({
            is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
            is_formatted: formatVocabularyEntry(
              formatPrefixes(row.icelandic, row.english)
            ),
            from: "is",
            id: getHash(row.icelandic) + "_is",
            spokenSentences: getSpokenSentences(row.icelandic),
            ...cardSkeleton,
          } as CardData);
        }
      }

      /* English to Icelandic */
      if (row.direction !== "->") {
        toAdd.push({
          is_plaintext: getPlaintextFromVocabularyEntry(row.icelandic),
          is_formatted: formatVocabularyEntry(row.icelandic),
          from: "en",
          id: getHash(row.icelandic) + "_en",
          spokenSentences: getSpokenSentences(row.icelandic),
          ...cardSkeleton,
        } as CardData);
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
    [sentenceHash: string]: {
      terms: CardData["terms"];
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

    card.is_plaintext.split(/ ?[,;-] ?/g).forEach((sentence) => {
      /* Notað til að bæta við strengjum sem eru splittaðir með bandstriki */
      const sentenceHash = getHash(sentence);
      if (!(sentenceHash in terms) && !(sentenceHash in alternativeIds)) {
        automaticAltIds[sentenceHash] = {
          terms: card.terms,
          score: 0,
        };
        // if (sentence.match(/frá sér/)) {
        //   console.log(sentence);
        // }
      }

      /* Prefixar */
      if (sentence.match(isPrefix) && card.en_plaintext.match(enPrefix)) {
        const without = sentence.replace(isPrefix, "");
        const score = prefixes
          .map((i) => i[0])
          .indexOf((sentence.match(isPrefix)?.[1] as string).toLowerCase());
        const hash = getHash(without);
        if (
          hash in terms ||
          hash in alternativeIds ||
          (hash in automaticAltIds && automaticAltIds[hash].score < score) ||
          ["að"].includes(without)
        )
          return;
        automaticAltIds[hash] = {
          terms: card.terms,
          score: score,
        };
      }
    });
  }

  /* TODO: Spaghetti code */
  let automaticAltIds2: {
    [sentenceHash: string]: CardData["terms"];
  } = {};
  Object.keys(automaticAltIds).forEach((i) => {
    automaticAltIds2[i] = automaticAltIds[i].terms;
    alternativeIds[i] = automaticAltIds[i].terms;
  });

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
    card.is_plaintext.split(/[,;] ?/g).forEach((sentence) => {
      const split = sentence.replace(/[,.!;:?"„“]/g, "").split(/ /g);
      const minLen = 1;
      for (let i = 0; i + minLen <= split.length && i <= 5; i++) {
        for (let b = i + minLen; b <= split.length && b <= i + 5; b++) {
          if (i === 0 && b === split.length) continue;
          const range = split.slice(i, b).join(" ");

          if (ignoredAutomaticWords.includes(range.toLowerCase())) {
            continue;
          }

          const hash = getHash(range);
          const termIds = [
            hash,
            ...(alternativeIds[hash] || []),
            ...(automaticAltIds2[hash] || []),
          ];

          termIds.forEach((term_id) => {
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
    alternative_ids: alternativeIds,
    plaintext_sentences: plaintextSentences,
    cards,
    sound,
  };
};
