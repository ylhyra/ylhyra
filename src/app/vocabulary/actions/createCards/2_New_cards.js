import { getUserData } from "app/vocabulary/actions/sync";
import { deck } from "app/vocabulary/actions/deck";
import { CARDS_TO_CREATE } from "app/vocabulary/actions/createCards/index";
import { SortBySortKey } from "app/vocabulary/actions/createCards/functions";

export default ({ forbidden_ids, allowed_card_ids }) => {
  /* New cards */
  let new_card_ids = [];
  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const { id } = deck.cards_sorted[i];
    if (forbidden_ids.includes(id)) continue;
    if (allowed_card_ids && !allowed_card_ids.includes(id)) continue;
    if (new_card_ids.length < CARDS_TO_CREATE || deck.isEasinessLevelOn()) {
      if (!(id in deck.schedule)) {
        new_card_ids.push(id);
      }
    } else {
      break;
    }
  }
  /* Sort new cards */
  if (allowed_card_ids) {
    new_card_ids.sort(
      (a, b) => allowed_card_ids.indexOf(a) - allowed_card_ids.indexOf(b)
    );
  } else if (deck.isEasinessLevelOn()) {
    new_card_ids = new_card_ids
      .map((id) => {
        const { sortKey } = deck.cards[id];
        return {
          key:
            sortKey > getUserData("easinessLevel") ? sortKey : 100000 - sortKey,
          id,
        };
      })
      .sort((a, b) => a.key - b.key)
      .map((v) => v.id);
    // console.log(_.uniq(new_card_ids.slice(0, 15).map(printWord)).join(" - "));
  } else {
    new_card_ids = SortBySortKey(new_card_ids);
  }

  return {
    new_card_ids,
  };
};
