import { userStore } from "flashcards/frontend/user/store";
import { createContext } from "react";
import { flashcardStore } from "flashcards/frontend/flashcards/store";

export const store = {
  userStore: new userStore(),
  flashcardStore: new flashcardStore(),
};

export const StoreContext = createContext<Store>(store);

export type Store = typeof store;
