import {
  setUserDataKey,
  UserData,
} from "flashcards/flashcards/actions/userData/userData";
import { CardId, ScheduleData } from "flashcards/flashcards/types/types";
import { Schedule } from "flashcards/flashcards/userDataStore";

export const getScheduleFromUserData = (userData: UserData): Schedule => {
  const schedule: Schedule = {};
  Object.keys(userData?.rows || {}).forEach((key) => {
    if (userData.rows[key].type === "schedule") {
      schedule[key] = userData.rows[key].value;
    }
  });
  return schedule;
};

export const saveScheduleForCardId = (cardId: CardId) => {
  setUserDataKey(cardId, getEntireSchedule()[cardId], "schedule");
};
