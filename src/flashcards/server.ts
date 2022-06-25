/* eslint-disable import/no-commonjs */
import { expressServer } from "modules/server/boilerplate";

expressServer({
  cookieName: "flashcards",
  port: 9123,
  use: [
    require("flashcards/user/login.server"),
    require("flashcards/flashcards/actions/userData/sync.server"),
  ],
});
