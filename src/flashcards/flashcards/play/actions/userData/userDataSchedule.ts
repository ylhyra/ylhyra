import { deck } from "flashcards/flashcards/play/actions/deck";
import {
  setUserData,
  UserData,
} from "flashcards/flashcards/play/actions/userData/userData";

export const getScheduleFromUserData = (
  user_data: UserData
): { [cardId: string]: ScheduleData } => {
  const schedule = {};
  Object.keys(user_data?.rows || {}).forEach((key) => {
    if (user_data.rows[key].type === "schedule") {
      schedule[key] = user_data.rows[key].value;
    }
  });
  return schedule;
};

export const saveScheduleForCardId = (cardId: CardId) => {
  setUserData(cardId, deck!.schedule[cardId], "schedule");
};
