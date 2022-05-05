import {
  setUserData,
  UserData,
} from "flashcards/flashcards/actions/userData/userData";
import { CardId, ScheduleData } from "flashcards/flashcards/types/types";

export const getScheduleFromUserData = (
  userData: UserData
): { [cardId: string]: ScheduleData } => {
  const schedule = {};
  Object.keys(userData?.rows || {}).forEach((key) => {
    if (userData.rows[key].type === "schedule") {
      schedule[key] = userData.rows[key].value;
    }
  });
  return schedule;
};

export const saveScheduleForCardId = (cardId: CardId) => {
  setUserData(cardId, getEntireSchedule()[cardId], "schedule");
};
