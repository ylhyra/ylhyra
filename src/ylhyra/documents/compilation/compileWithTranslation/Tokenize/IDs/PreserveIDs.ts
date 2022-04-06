/*

  - Compares old and new tokenization and attempts to preserve IDs.
  - This is done to prevent loss of translations when editing the input text.

  Input:
    1. Old tokenized text
    2. New tokenized text
  Output:
    1. New tokenized text with preserved IDs when possible

*/

import { diffArrays } from "diff";
import { findBestMatch } from "string-similarity";
import flattenArray from "ylhyra/app/app/functions/flattenArray";
import { TokenizedParagraphsWithIds } from "ylhyra/documents/types";

export default function Preserve(
  first: TokenizedParagraphsWithIds,
  second: TokenizedParagraphsWithIds
) {
  /* Map from new IDs to preserved IDs */
  const PreservedIDs = {
    /* Compares old and new sentences */
    ...diffAndPreserveIDs(
      simplifiedSentencesArray(first),
      simplifiedSentencesArray(second)
    ),
    /* Compares old and new words */
    ...diffAndPreserveIDs(
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
        if (typeof word === "string") {
          return word;
        }
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
  Output: Map of new IDs to preserved IDs
*/
const diffAndPreserveIDs = (
  first: SimplifiedArrayOfIdsAndText,
  second: SimplifiedArrayOfIdsAndText
): { [newId: string]: string } => {
  let newIdsToPreservedIds: Record<string, string> = {};
  let firstIndex = 0;
  let secondIndex = 0;
  const diff = diffArrays(
    first.map((i) => i.text),
    second.map((i) => i.text)
  );

  /**
   * Keeps track of the position of unmatched ids relative to the diff.
   * Stored on the ad-hoc format { `${diffPartIndex}_${diffValueIndex}`: id }
   */
  let diffPositionsToUnmatchedIds: Record<string, string> = {};

  /** Find perfect matches */
  diff.forEach((diffPart, diffPartIndex) => {
    diffPart.value.forEach((diffValue, diffValueIndex) => {
      if (diffPart.removed) {
        /* Save id in `diff` to find the closest match later */
        diffPositionsToUnmatchedIds[`${diffPartIndex}_${diffValueIndex}`] =
          first[firstIndex].id;
        firstIndex++;
      } else if (diffPart.added) {
        /* Save id in `diff` to find the closest match later */
        diffPositionsToUnmatchedIds[`${diffPartIndex}_${diffValueIndex}`] =
          second[secondIndex].id;
        secondIndex++;
      } else {
        /* Map new ID to preserved ID */
        newIdsToPreservedIds[second[secondIndex].id] = first[firstIndex].id;
        firstIndex++;
        secondIndex++;
      }
    });
  });

  /** Attempt to find the closest match */
  diff.forEach((part, partIndex: number) => {
    if (
      diff[partIndex + 1] &&
      diff[partIndex].removed &&
      diff[partIndex + 1].added
    ) {
      const removed = diff[partIndex];
      const added = diff[partIndex + 1];
      let remainingPossibleAddedValues = added.value;
      removed.value.forEach((removed_value, removedIndex) => {
        if (remainingPossibleAddedValues.length < 1) return;
        const { bestMatch, bestMatchIndex } = findBestMatch(
          removed_value,
          remainingPossibleAddedValues
        );
        if (bestMatch.rating < 0.3) return;
        const removedId =
          diffPositionsToUnmatchedIds[`${partIndex}_${removedIndex}`];
        const addedId =
          diffPositionsToUnmatchedIds[`${partIndex + 1}_${bestMatchIndex}`];
        newIdsToPreservedIds[addedId] = removedId;
        remainingPossibleAddedValues.splice(bestMatchIndex, 1);
      });
    }
  });

  return newIdsToPreservedIds;
};

/**
 * Create flat arrays of words and sentences.
 *
 * Output:
 *   - Simplified array on the form: [{ id, text }, { id, text }].
 *   - All punctuation is removed to make diff simpler.
 */
const simplifiedSentencesArray = (
  paragraphs: TokenizedParagraphsWithIds
): SimplifiedArrayOfIdsAndText => {
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
  ) as SimplifiedArrayOfIdsAndText;
};

const simplifiedWordsArray = (
  paragraphs: TokenizedParagraphsWithIds
): SimplifiedArrayOfIdsAndText => {
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
  ) as SimplifiedArrayOfIdsAndText;
};

type SimplifiedArrayOfIdsAndText = Array<{
  id: string;
  text: string;
}>;
