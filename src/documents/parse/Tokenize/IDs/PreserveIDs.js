/*

  - Compares old and new tokenization and attempts to preserve IDs.
  - This is done to prevent loss of translations when editing the input text.

  Input:
    1. Old tokenized text
    2. New tokenised text
  Output:
    1. New tokenized text with preserved IDs when possible

*/

import { diffArrays } from "diff";
import flattenArray from "app/app/functions/flattenArray";
import { findBestMatch } from "string-similarity";

const Preserve = (first, second) => {
  /* Map from new IDs to preserved IDs */
  const PreservedIDs = {
    /* Compares old and new sentences */
    ...DiffAndPreserveIDs(SentencesArray(first), SentencesArray(second)),
    /* Compares old and new words */
    ...DiffAndPreserveIDs(WordsArray(first), WordsArray(second)),
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
};
export default Preserve;

/*
  Input: Two arrays of only IDs & text.
  Ouput: Map of new IDs to preserved IDs
*/
const DiffAndPreserveIDs = (first, second) => {
  let ids = {};
  let first_index = 0;
  let second_index = 0;
  const diff = diffArrays(
    first.map((i) => i.text),
    second.map((i) => i.text)
  );

  /* Keeps track of removed and added parts */
  let unmatched_ids = {};

  /* Find perfect matches */
  diff.forEach((part, part_index) => {
    part.value.forEach((value, value_index) => {
      if (part.removed) {
        /* Save id in `diff` to find closest match later */
        unmatched_ids[`${part_index}_${value_index}`] = first[first_index].id;
        first_index++;
      } else if (part.added) {
        /* Save id in `diff` to find closest match later */
        unmatched_ids[`${part_index}_${value_index}`] = second[second_index].id;
        second_index++;
      } else {
        /* Map new ID to preserved ID */
        ids[second[second_index].id] = first[first_index].id;
        first_index++;
        second_index++;
      }
    });
  });

  /* Attempt to find the closest match */
  diff.forEach((part, part_index) => {
    if (
      diff[part_index + 1] &&
      diff[part_index].removed &&
      diff[part_index + 1].added // || (diff[index].added && diff[index + 1].removed)
    ) {
      const removed = diff[part_index];
      const added = diff[part_index + 1];
      let remaining_possible_added_values = added.value;
      removed.value.forEach((removed_value, removed_index) => {
        if (remaining_possible_added_values.length < 1) return;
        const { bestMatch, bestMatchIndex } = findBestMatch(
          removed_value,
          remaining_possible_added_values
        );
        if (bestMatch.rating < 0.3) return;
        const removed_id = unmatched_ids[`${part_index}_${removed_index}`];
        const added_id = unmatched_ids[`${part_index + 1}_${bestMatchIndex}`];
        ids[added_id] = removed_id;
        remaining_possible_added_values.splice(bestMatchIndex, 1);
      });
    }
  });

  return ids;
};

/*
  Create flat arrays of words and sentences.

  Input:
    - Tokenized data
  Output:
    - Simplified array on the form: [{ id, text }, { id, text }].
    - All punctuation is removed to make diff simpler.
*/
const SentencesArray = (paragraphs) => {
  return flattenArray(
    paragraphs.map((paragraph) => {
      return paragraph.sentences.map((sentence) => {
        return {
          id: sentence.id,
          text: sentence.words
            .map((word) => {
              return word.text;
            })
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      });
    })
  );
};
const WordsArray = (paragraphs) => {
  return flattenArray(
    paragraphs.map((paragraph) => {
      return paragraph.sentences.map((sentence) => {
        return sentence.words
          .map((word) => {
            if (!word.id) return null;
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

//
// const ONE = [{
//     "id": "w__Eiríkur",
//     "text": "Eiríkur"
//   },
//   {
//     "id": "w__dansar",
//     "text": "dansar"
//   },
//   {
//     "id": "w__svo",
//     "text": "svo"
//   },
//   {
//     "id": "w__vel",
//     "text": "vel"
//   }, {
//     "id": "w__Hann",
//     "text": "Hann"
//   }, {
//     "id": "w__dansar",
//     "text": "dansar"
//   }, {
//     "id": "w__betur",
//     "text": "betur"
//   }, {
//     "id": "w__en",
//     "text": "en"
//   }, {
//     "id": "w__ég",
//     "text": "ég"
//   }
// ]
// const TWO = [{
//   "id": "NEW_w__Test",
//   "text": "Test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Eiríkur",
//   "text": "Eiríkur"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w__svo",
//   "text": "svo"
// }, {
//   "id": "NEW_w__vel",
//   "text": "vel"
// }, {
//   "id": "NEW_w__Hann",
//   "text": "Hann"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w_0_betur",
//   "text": "betur"
// }, {
//   "id": "NEW_w_7_en",
//   "text": "en"
// }, {
//   "id": "NEW_w_O_ég",
//   "text": "ég"
// }]
//
// console.log({ DiffAndPreserveIDs: DiffAndPreserveIDs(ONE, TWO) })
