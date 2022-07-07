import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { store } from "flashcards/store";
import type {
  LoginRequest,
  LoginResponse,
} from "flashcards/user/login/login.server";
import { action } from "mobx";
import axios2 from "modules/axios2";
import { goToUrl } from "modules/router";

export async function login(values: LoginRequest) {
  const response = (await axios2.post("/api/login", values)) as LoginResponse;

  const { userId, username } = response;

  action(() => {
    store.user = { userId, username };
    goToUrl("/");
  })();
}

export const logout = async () => {
  await axios2.post("/api/logout");
  action(() => {
    store.user = null;
    goToUrl("/");
  })();
};

export function isUserLoggedIn() {
  return getUserFromCookie() !== null;
}

export function existsSchedule() {
  // return getEntireSchedule() && Object.keys(getEntireSchedule()).length >= 6;
}

/* Called on route changes */
// TODO!! Should sync
export function updateUser() {
  // const user = getUserFromCookie();
  // if (store.getState().user?.userId !== user?.userId) {
  //   store.dispatch({
  //     type: "LOAD_USER",
  //     content: user,
  //   });
  // }
}
