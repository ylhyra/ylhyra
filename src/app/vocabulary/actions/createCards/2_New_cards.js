import { deck } from "app/vocabulary/actions/deck";
import { CARDS_TO_CREATE } from "app/vocabulary/actions/createCards/index";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { getNewCards } from "app/vocabulary/actions/card/functions";

/* New cards */
export default ({ forbidden_ids, allowed_ids }) => {
  let new_cards = getNewCards().filter((card) =>
    card.isAllowed({ forbidden_ids, allowed_ids })
  );

  /* Sort new cards */
  if (allowed_ids) {
    new_cards.sort(
      (a, b) => allowed_ids.indexOf(a.getId()) - allowed_ids.indexOf(b.getId())
    );
  } else if (isEasinessLevelOn()) {
    new_cards = new_cards.sort(
      (a, b) =>
        a.getSortKeyAdjustedForEasinessLevel() -
        b.getSortKeyAdjustedForEasinessLevel()
    );
  } else {
    new_cards = sortBySortKey(new_cards);
  }

  return {
    new_cards,
  };
};
