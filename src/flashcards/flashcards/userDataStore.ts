import {
  UnprocessedDeck,
  UnprocessedDecksObject,
} from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { UserData } from "flashcards/flashcards/actions/userData/userData";

export type Schedule = Record<CardId, Partial<ScheduleData>>;

export class userDataStore {
  schedule: Schedule = {};
  userData: UserData | null = null;
  constructor() {
    makeAutoObservable(this);
  }
}

const store = new userDataStore();
export const getUserDataStore = (): userDataStore => store;
