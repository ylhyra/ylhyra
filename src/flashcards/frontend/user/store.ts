import { makeAutoObservable } from "mobx";
import { getUserFromCookie } from "modules/cookie";

export type UserId = string;
export type Username = string;

export type UserProfile = {
  userId: UserId;
  username: Username;
} | null;

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
