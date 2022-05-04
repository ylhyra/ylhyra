import { userStore } from "flashcards/user/store";
import { createContext } from "react";

export const store = {
  userStore: new userStore(),
  // flashcardStore: new flashcardStore(),
};

export const StoreContext = createContext<Store>(store);

export type Store = typeof store;
