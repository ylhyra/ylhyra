import { UserData } from "flashcards/flashcards/actions/userData/userData";
import { CardId, ScheduleData } from "flashcards/flashcards/types/types";
import { makeAutoObservable } from "mobx";

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
export const getSchedule = (): Schedule => getUserDataStore().schedule;
