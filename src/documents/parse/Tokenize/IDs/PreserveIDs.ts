/*

  - Compares old and new tokenization and attempts to preserve IDs.
  - This is done to prevent loss of translations when editing the input text.

  Input:
    1. Old tokenized text
    2. New tokenised text
  Output:
    1. New tokenized text with preserved IDs when possible

*/

import flattenArray from "app/app/functions/flattenArray";
import { diffArrays } from "diff";
import { TokenizedParagraphsWithIds } from "documents/parse/types";
import { findBestMatch } from "string-similarity";

export default function Preserve(
  first: TokenizedParagraphsWithIds,
  second: TokenizedParagraphsWithIds
) {
  /* Map from new IDs to preserved IDs */
  const PreservedIDs = {
    /* Compares old and new sentences */
    ...DiffAndPreserveIDs(
      simplifiedSentencesArray(first),
      simplifiedSentencesArray(second)
    ),
    /* Compares old and new words */
    ...DiffAndPreserveIDs(
      simplifiedWordsArray(first),
      simplifiedWordsArray(second)
    ),
  };

  /* Return with preserved IDs */
  return second.map((paragraph) => ({
    ...paragraph,
    sentences: paragraph.sentences.map((sentence) => ({
      ...sentence,
      id: PreservedIDs[sentence.id] || sentence.id,
      words: sentence.words.map((word) => {
        if (!word.id) return word;
        return {
          ...word,
          id: PreservedIDs[word.id] || word.id,
        };
      }),
    })),
  }));
}

/*
  Input: Two arrays of only IDs & text.
  Ouput: Map of new IDs to preserved IDs
*/
const DiffAndPreserveIDs = (
  first: TokenizedParagraphsWithIds,
  second: TokenizedParagraphsWithIds
) => {
  let ids = {};
  let firstIndex = 0;
  let secondIndex = 0;
  const diff = diffArrays(
    first.map((i) => i.text),
    second.map((i) => i.text)
  );

  /* Keeps track of removed and added parts */
  let unmatchedIds = {};

  /* Find perfect matches */
  diff.forEach((part, partIndex) => {
    part.value.forEach((value, valueIndex) => {
      if (part.removed) {
        /* Save id in `diff` to find closest match later */
        unmatchedIds[`${partIndex}_${valueIndex}`] = first[firstIndex].id;
        firstIndex++;
      } else if (part.added) {
        /* Save id in `diff` to find closest match later */
        unmatchedIds[`${partIndex}_${valueIndex}`] = second[secondIndex].id;
        secondIndex++;
      } else {
        /* Map new ID to preserved ID */
        ids[second[secondIndex].id] = first[firstIndex].id;
        firstIndex++;
        secondIndex++;
      }
    });
  });

  /* Attempt to find the closest match */
  diff.forEach((part, partIndex) => {
    if (
      diff[partIndex + 1] &&
      diff[partIndex].removed &&
      diff[partIndex + 1].added // || (diff[index].added && diff[index + 1].removed)
    ) {
      const removed = diff[partIndex];
      const added = diff[partIndex + 1];
      let remaining_possible_added_values = added.value;
      removed.value.forEach((removed_value, removedIndex) => {
        if (remaining_possible_added_values.length < 1) return;
        const { bestMatch, bestMatchIndex } = findBestMatch(
          removed_value,
          remaining_possible_added_values
        );
        if (bestMatch.rating < 0.3) return;
        const removed_id = unmatchedIds[`${partIndex}_${removedIndex}`];
        const added_id = unmatchedIds[`${partIndex + 1}_${bestMatchIndex}`];
        ids[added_id] = removed_id;
        remaining_possible_added_values.splice(bestMatchIndex, 1);
      });
    }
  });

  return ids;
};

/*
  Create flat arrays of words and sentences.

  Output:
    - Simplified array on the form: [{ id, text }, { id, text }].
    - All punctuation is removed to make diff simpler.
*/
const simplifiedSentencesArray = (
  paragraphs: TokenizedParagraphsWithIds
): Array<
  Array<{
    id: string;
    text: string;
  }>
> => {
  return flattenArray(
    paragraphs.map((paragraph) => {
      return paragraph.sentences.map((sentence) => {
        return {
          id: sentence.id,
          text: sentence.words
            .map((word) => {
              if (typeof word === "string") {
                return word;
              } else {
                return word.text;
              }
            })
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      });
    })
  );
};

const simplifiedWordsArray = (paragraphs: TokenizedParagraphsWithIds) => {
  return flattenArray(
    paragraphs.map((paragraph) => {
      return paragraph.sentences.map((sentence) => {
        return sentence.words
          .map((word) => {
            if (typeof word === "string") return null;
            return {
              id: word.id,
              text: word.text.toLowerCase(),
            };
          })
          .filter(Boolean);
      });
    })
  );
};
