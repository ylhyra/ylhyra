import userStore from "flashcards/frontend/user/store";
// import { routeStore } from "modules/router";
import { createContext } from "react";

export const StoreContext = createContext<Store>(null);

export const store = {
  userStore: new userStore(),
};

export type Store = typeof store;
