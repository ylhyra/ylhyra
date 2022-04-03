import { getUserFromCookie } from "flashcards/cookie";
import { UserProfile } from "flashcards/frontend/user/types";
import { makeAutoObservable } from "mobx";

export class userStore {
  user: UserProfile = getUserFromCookie();
  constructor() {
    makeAutoObservable(this);
  }
  load(values: UserProfile) {
    this.user = values;
  }
  logout = () => {
    this.user = null;
  };
}
