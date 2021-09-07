import { hour, now } from "app/app/functions/time";
import { getCardsWithSameTerm } from "app/vocabulary/actions/functions";
import { deck } from "app/vocabulary/actions/deck";
import { shuffleEach } from "app/app/functions/shuffleEach";

// const ScoreByTimeSinceTermWasSeen = (id) => {
//   let latest = null;
//   getCardsWithSameTerm(id).forEach((sibling_card_id) => {
//     if (
//       deck.schedule[sibling_card_id] &&
//       deck.schedule[sibling_card_id].last_seen > latest
//     ) {
//       latest = deck.schedule[sibling_card_id].last_seen;
//     }
//   });
//   const hoursSinceSeen = (now() - latest) / hour;
//   if (hoursSinceSeen < 0.3) {
//     return 3;
//   } else if (hoursSinceSeen < 2) {
//     return 2;
//   } else if (hoursSinceSeen < 12) {
//     return 1;
//   } else if (hoursSinceSeen < 30) {
//     return 0.5;
//   } else {
//     return 0;
//   }
// };

export const sortCardsByWhetherTermWasRecentlySeen = (cards, reverse) => {
  return cards;
  // let j = cards
  //   .sort(
  //     (a, b) =>
  //       a.hours_since_term_seen_score - b.hours_since_term_seen_score ||
  //       a.getLastSeen() - b.getLastSeen()
  //   );
  // if (reverse) {
  //   j = j.reverse();
  // }
  // return j.map((i) => i.id);
};

export const sortCardsByScore = (cards) => {
  return cards.sort((a, b) => a.getScore() - b.getScore());
};

export const sortBySortKey = (cards) => {
  const x = cards.sort((a, b) => a.sortKey - b.sortKey);
  return shuffleEach(x, 20);
};
