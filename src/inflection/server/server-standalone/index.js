import { staticCached } from "server/caching";
import express from "express";
import path from "path";

const app = express();
const port = 4545;

app.use(
  "/inflection_styles",
  staticCached(path.join(__dirname, "/../../styles"))
);
app.use("/", require(path.join(__dirname, "./route_loader")).default);

app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message);
  }
});
