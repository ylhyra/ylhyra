import { clearTimeMemoized } from "modules/time";
import { flatten, uniq } from "underscore";
import { getTermIds } from "ylhyra/vocabulary/app/actions/card/card_data";
import { getCardIdsFromTermId } from "ylhyra/vocabulary/app/actions/card/term";
import {
  CardId,
  CardIds,
  TermIds,
} from "ylhyra/vocabulary/app/actions/card/types";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { getHash } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";

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
  // deck!.cards_sorted.forEach((card) => {
  //   card.clearMemoizations();
  // });
  clearTimeMemoized();
};
