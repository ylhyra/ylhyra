import { CardId, ScheduleData } from "flashcards/flashcards/types/types";
import { UserData, UserDataRows } from "flashcards/flashcards/types/userData";
import { makeAutoObservable } from "mobx";
import { Timestamp } from "modules/time";

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
