/* eslint-disable import/no-commonjs */
import { COOKIE_NAME } from "flashcards/app/functions/cookie";
import { expressServer } from "modules/server/boilerplate";

expressServer({
  cookieName: COOKIE_NAME,
  port: 9123,
  use: [
    require("flashcards/user/login/login.server"),
    require("flashcards/sync/sync.server"),
  ],
});
