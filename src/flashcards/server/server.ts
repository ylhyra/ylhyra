import { expressServer } from "modules/server/boilerplate";

expressServer({
  cookieName: "flashcards",
  port: 9123,
  use: [require("flashcards/frontend/user/login.server")],
});
