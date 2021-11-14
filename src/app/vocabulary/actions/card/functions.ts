import { deck } from "app/vocabulary/actions/deck";
import { flatten, uniq } from "underscore";
import { getHash } from "maker/vocabulary_maker/compile/functions";
import { clearTimeMemoized } from "app/app/functions/time";
import { getTermIds } from "./card_data";
import { getCardIds } from "app/vocabulary/actions/card/term";
import { CardIds, TermIds } from "app/vocabulary/actions/card/types";

export const getCardIdsFromTermIds = (term_ids: TermIds) => {
  return uniq(flatten(term_ids.map((t) => getCardIds(t)).filter(Boolean)));
};

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(flatten(ids.map((id) => getTermIds(id))));
};

export const getCardByText = (text) => {
  return deck.cards[getHash(text) + "_is"];
};

export const rememoizeCards = () => {
  // deck.cards_sorted.forEach((card) => {
  //   card.clearMemoizations();
  // });
  clearTimeMemoized();
};
