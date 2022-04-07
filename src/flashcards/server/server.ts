import { expressServer } from "modules/server/boilerplate";

expressServer({
  cookieName: "flashcards",
  port: 9123,
  use: [require("server/user/login")],
});
