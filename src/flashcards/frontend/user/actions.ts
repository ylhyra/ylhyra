import { store } from "flashcards/frontend/store";
import type {
  LoginRequest,
  LoginResponse,
} from "flashcards/frontend/user/login.server";
import axios2 from "modules/axios2";
import { customHistory } from "modules/router";

export const login = async (values: LoginRequest) => {
  const response = (await axios2.post("/api/login", values)) as LoginResponse;

  const { userId, username } = response;

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
