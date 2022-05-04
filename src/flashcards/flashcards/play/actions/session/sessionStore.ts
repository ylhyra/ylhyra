import { makeAutoObservable } from "mobx";

export class sessionStore {
  cards = {};

  constructor() {
    makeAutoObservable(this);
  }
}

/**
 * Trying out whether global stores are better than context stores
 */
const s = new sessionStore();

export const getSession = (): sessionStore => {
  return s;
};
