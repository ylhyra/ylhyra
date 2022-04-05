import { clearTimeMemoized } from "modules/time";
import { flatten, uniq } from "underscore";
import { getTermIds } from "ylhyra/app/vocabulary/actions/card/card_data";
import { getCardIdsFromTermId } from "ylhyra/app/vocabulary/actions/card/term";
import {
  CardId,
  CardIds,
  TermIds,
} from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { getHash } from "ylhyra/maker/vocabulary_maker/compile/functions";

export const getCardIdsFromTermIds = (termIds: TermIds) => {
  return uniq(
    flatten(termIds.map((t) => getCardIdsFromTermId(t)).filter(Boolean))
  );
};

export const getTermIdsFromCardIds = (ids: CardIds): TermIds => {
  return uniq(flatten(ids.map((id) => getTermIds(id))));
};

export const getCardByText = (text: string) => {
  return deck?.cards[(getHash(text) + "_is") as CardId];
};

export const rememoizeCards = () => {
  // deck.cards_sorted.forEach((card) => {
  //   card.clearMemoizations();
  // });
  clearTimeMemoized();
};
