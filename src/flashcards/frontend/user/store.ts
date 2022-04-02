import { UserProfile } from "flashcards/frontend/user/types";
import { makeAutoObservable } from "mobx";
import { getUserFromCookie } from "modules/cookie";

export default class userStore {
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
