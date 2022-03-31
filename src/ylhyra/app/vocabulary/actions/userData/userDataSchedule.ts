import { CardId } from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { setUserData } from "ylhyra/app/vocabulary/actions/userData/userData";

// /**
//  * @param {UserData} user_data
//  * @returns {Object.<CardID, ScheduleData>}
//  */
export const getScheduleFromUserData = (user_data) => {
  const schedule = {};
  Object.keys(user_data?.rows || {}).forEach((key) => {
    if (user_data.rows[key].type === "schedule") {
      schedule[key] = user_data.rows[key].value;
    }
  });
  return schedule;
};

export const saveScheduleForCardId = (card_id: CardId) => {
  setUserData(card_id, deck.schedule[card_id], "schedule");
};
