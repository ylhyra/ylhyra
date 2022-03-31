import { makeAutoObservable } from "mobx";
import { getUserFromCookie } from "modules/cookie";
import { UserProfile } from "flashcards/frontend/user/";

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
