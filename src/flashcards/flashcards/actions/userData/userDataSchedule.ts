import { Card } from "flashcards/flashcards/actions/card/card";
import { setUserDataKey } from "flashcards/flashcards/actions/userData/userData";
import { UserData } from "flashcards/flashcards/actions/userData/userData.types";
import {
  getEntireSchedule,
  Schedule,
} from "flashcards/flashcards/actions/userData/userDataStore";

export function getScheduleFromUserData(userData: UserData): Schedule {
  const schedule: Schedule = {};
  Object.keys(userData?.rows || {}).forEach((key) => {
    if (userData.rows[key].type === "schedule") {
      schedule[key] = userData.rows[key].value;
    }
  });
  return schedule;
}

export function saveCardSchedule(this: Card) {
  setUserDataKey(this.cardId, getEntireSchedule()[this.cardId], "schedule");
}
