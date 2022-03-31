import userStore from "flashcards/frontend/user/store";
// import { routeStore } from "modules/router";
import { createContext } from "react";

export const store = {
  userStore: new userStore(),
  // friendsStore: new friendsStore(),
  // meetingsStore: new meetingsStore(),
  // routeStore: new routeStore(),
};

export const StoreContext = createContext<Store>(store);

export type Store = typeof store;
