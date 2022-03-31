import friendsStore from "flashcards/friends/store";
import meetingsStore from "flashcards/meetings/store";
import userStore from "flashcards/user/store";
// import { routeStore } from "modules/router";
import { createContext } from "react";

export const StoreContext = createContext<Store>(null);

export const store = {
  userStore: new userStore(),
  friendsStore: new friendsStore(),
  meetingsStore: new meetingsStore(),
  // routeStore: new routeStore(),
};

export type Store = typeof store;
