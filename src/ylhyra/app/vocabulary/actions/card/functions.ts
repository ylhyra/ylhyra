import { clearTimeMemoized } from "modules/time";
import { getCardIds } from "ylhyra/app/vocabulary/actions/card/term";
import { CardIds, TermIds } from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { getHash } from "ylhyra/maker/vocabulary_maker/compile/functions";
import { flatten, uniq } from "underscore";
import { getTermIds } from "ylhyra/app/vocabulary/actions/card/card_data";

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
