import { UserData } from "flashcards/flashcards/actions/userData/userData.types";
import { CardId, ScheduleData } from "flashcards/flashcards/types";
import { makeAutoObservable } from "mobx";

export type Schedule = Record<CardId, Partial<ScheduleData>>;

export class userDataStore {
  schedule: Schedule = {};
  userData: UserData = {
    rows: {},
  };
  constructor() {
    makeAutoObservable(this);
  }
}

const store = new userDataStore();
export const getUserDataStore = (): userDataStore => store;
export const getEntireSchedule = (): Schedule => getUserDataStore().schedule;
export const getUserData = (): UserData => getUserDataStore().userData;
export const setUserData = (input: UserData) => {
  store.userData = input;
};
export const setEntireSchedule = (input: Schedule) => {
  throw new Error("Not implemented");
};
