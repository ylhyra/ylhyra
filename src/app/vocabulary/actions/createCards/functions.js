import { hour } from "app/app/functions/time";
import { getCardsWithSameTerm } from "app/vocabulary/actions/functions";
import { deck } from "app/vocabulary/actions/deck";
import { shuffleEach } from "app/app/functions/shuffleEach";

const ScoreByTimeSinceTermWasSeen = (id, now) => {
  let latest = null;
  getCardsWithSameTerm(id).forEach((sibling_card_id) => {
    if (
      deck.schedule[sibling_card_id] &&
      deck.schedule[sibling_card_id].last_seen > latest
    ) {
      latest = deck.schedule[sibling_card_id].last_seen;
    }
  });
  const hoursSinceSeen = (now - latest) / hour;
  if (hoursSinceSeen < 0.3) {
    return 3;
  } else if (hoursSinceSeen < 2) {
    return 2;
  } else if (hoursSinceSeen < 12) {
    return 1;
  } else if (hoursSinceSeen < 30) {
    return 0.5;
  } else {
    return 0;
  }
};

export const SortIdsByWhetherTermWasRecentlySeen = (input, reverse) => {
  const now = new Date().getTime();
  let j = input
    .map((id) => ({
      id,
      hours_since_term_seen_score: ScoreByTimeSinceTermWasSeen(id, now),
      card_last_seen: deck.schedule[id]?.last_seen,
    }))
    .sort(
      (a, b) =>
        a.hours_since_term_seen_score - b.hours_since_term_seen_score ||
        a.card_last_seen - b.card_last_seen
    );
  if (reverse) {
    j = j.reverse();
  }
  return j.map((i) => i.id);
};

export const SortIdsByScore = (input) => {
  return input
    .map((id) => ({
      id,
      score: deck.schedule[id]?.score || 0,
    }))
    .sort((a, b) => a.score - b.score)
    .map((i) => i.id);
};

export const SortBySortKey = (array) => {
  const x = array.sort((a, b) => deck.cards[a].sortKey - deck.cards[b].sortKey);
  return shuffleEach(x, 20);
};
