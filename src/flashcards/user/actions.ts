import { store } from "flashcards/app/store";
import { getUserFromCookie } from "flashcards/functions/cookie";
import type { LoginRequest, LoginResponse } from "flashcards/user/login.server";
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

export const isUserLoggedIn = () => {
  return getUserFromCookie() !== null;
};

export const existsSchedule = () => {
  // return getEntireSchedule() && Object.keys(getEntireSchedule()).length >= 6;
};

/* Called on route changes */
// TODO!! Should sync
export const updateUser = () => {
  // const user = getUserFromCookie();
  // if (store.getState().user?.user_id !== user?.user_id) {
  //   store.dispatch({
  //     type: "LOAD_USER",
  //     content: user,
  //   });
  // }
};
