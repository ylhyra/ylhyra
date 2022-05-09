import { setUserDataKey } from "flashcards/flashcards/actions/userData/userData";
import {
  getEntireSchedule,
  Schedule,
} from "flashcards/flashcards/actions/userData/userDataStore";
import { CardId } from "flashcards/flashcards/types/types";
import { UserData } from "flashcards/flashcards/types/userData";

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
