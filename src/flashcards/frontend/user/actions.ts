import { store } from "flashcards/frontend/store";
import axios2 from "modules/axios2";
import { customHistory } from "modules/router";
import type { LoginData, LoginResponse } from "flashcards/server/user/login";

export const login = async (values: LoginData) => {
  const response = (await axios2.post("/api/login", values)) as LoginResponse;

  const { userId, username, error } = response;
  if (error) throw new Error(error);
  console.log(response);

  store.userStore.load({
    username,
    userId,
  });
  customHistory.replace("/overview");
};

export const logout = async () => {
  await axios2.post("/api/logout");
  store.userStore.logout();
  customHistory.replace("/");
};
