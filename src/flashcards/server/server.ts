// import { isDev } from "app/app/modules/isDev";
import "dotenv/config";
import type { Request, Response } from "express";
import express from "express";
import { COOKIE_NAME } from "flashcards/cookie";
import argvFactory from "minimist";
import { isDev } from "modules/isDev";

const argv = argvFactory(process.argv.slice(2));
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(
  require("cookie-session")({
    name: COOKIE_NAME,
    keys: [process.env.COOKIE_SECRET || "secret"],
    // secure: true,
    secure: false,
    httpOnly: false,
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
  })
);
app.enable("strict routing");

if (!process.env.COOKIE_SECRET) {
  console.warn("Missing COOKIE_SECRET");
}

/* Set Unicode header on all responses */
app.use((req, res, next) => {
  res.setHeader("charset", "utf-8");
  next();
});

app.use("/", require("server/user/login").default);

app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof Error) {
    res.set("Content-Type", "text/txt");
    res.status(500).send({ error: err.message });
  } else {
    res.status(err.status || 500).send({ error: err.message });
  }
});

const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const port = process.env.SERVER_PORT || argv.port || 9124;

app.listen(port, host, () => {
  if (isDev) {
    console.log(`Running on port ${port}`);
  }
});

process.on("SIGINT", function () {
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error(err);
});
