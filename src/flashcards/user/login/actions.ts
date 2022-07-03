import { getUserFromCookie } from "flashcards/app/functions/cookie";
import type {
  LoginRequest,
  LoginResponse,
} from "flashcards/user/login/login.server";
import { getUserStore } from "flashcards/user/store";
import axios2 from "modules/axios2";
import { goToUrl } from "modules/router";

export async function login(values: LoginRequest) {
  const response = (await axios2.post("/api/login", values)) as LoginResponse;

  const { userId, username } = response;

  getUserStore().load({
    username,
    userId,
  });
  goToUrl("/overview");
}

export async function logout() {
  await axios2.post("/api/logout");
  getUserStore().logout();
  goToUrl("/");
}

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
  // if (store.getState().user?.user_id !== user?.user_id) {
  //   store.dispatch({
  //     type: "LOAD_USER",
  //     content: user,
  //   });
  // }
}
