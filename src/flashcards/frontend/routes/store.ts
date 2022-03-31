import friendsStore from "ylhyra/app/friends/store";
import meetingsStore from "ylhyra/app/meetings/store";
import userStore from "ylhyra/app/user/store";
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
