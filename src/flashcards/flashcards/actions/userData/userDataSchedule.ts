import { Card } from "flashcards/flashcards/actions/card/card";
import { setUserDataKey } from "flashcards/flashcards/actions/userData/userData";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";

export function saveCardSchedule(this: Card) {
  setUserDataKey(this.cardId, getEntireSchedule()[this.cardId], "schedule");
}
