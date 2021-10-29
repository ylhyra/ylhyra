// import 'source-map-support/register'
import "core-js/stable";
import "regenerator-runtime/runtime";

import { exec } from "child_process";
import path from "path";

import express from "express";
import argvFactory from "minimist";
import { processed_image_url, unprocessed_image_url } from "app/app/paths";
import {
  build_folder,
  image_output_folder,
  ylhyra_content_files,
} from "server/paths_backend";
import requestIp from "request-ip";
import query from "server/database";
import { isDev } from "app/app/functions/isDev";
import { staticCached } from "server/caching";

require("source-map-support").install();
require("dotenv").config({ path: "./../.env" });

const argv = argvFactory(process.argv.slice(2));

const app = express();
require("express-ws")(app);
const cors = require("cors");
app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(requestIp.mw());
app.use(require("express-useragent").express());
app.use(
  require("cookie-session")({
    name: "y",
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

// TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum, t.d. með "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
query(`SET sql_mode = ''`, () => {});
setTimeout(() => {
  query(`SET sql_mode = ''`, () => {});
}, 30 * 1000);

const mainapp = express();
mainapp.use(processed_image_url, staticCached(image_output_folder));
mainapp.use(unprocessed_image_url, staticCached(ylhyra_content_files));
mainapp.use("/", staticCached(build_folder));

/*
  Private APIs
*/
mainapp.use(cors({ origin: "https://ylhyra.is" }));
// app.use('/api', require('server/web-socket').default)
// app.use('/api', require('server/server-side-rendering').default)
mainapp.use("/api", require("server/audio/recorder").default);
// app.use('/api', require('server/audio/GetOneAudioFile').default)
// app.use('/api', require('server/audio/Synchronize').default)
// app.use('/api', require('server/translator/save').default)
mainapp.use("/api", require("server/translator/saveDocument").default);
mainapp.use("/api", require("server/analytics").default);
mainapp.use("/api", require("server/analytics/overview").default);
mainapp.use("/api", require("server/analytics/userErrors").default);
mainapp.use("/api", require("server/user").default);
mainapp.use("/api", require("server/user/pay").default);
mainapp.use("/api", require("server/vocabulary/sync").default);
mainapp.use(
  "/api",
  require("server/vocabulary/migration_session_log_2021_10").default
);
mainapp.use("/api", require("server/vocabulary/maker").default);
mainapp.use("/", require("server/content").default);

// // app.use('/api', require('server/tweets').default)
// // app.use('/api', require('server/audio').default)
// // app.use('/api', require('server/translator/Google').default)
// // app.use('/api', require('server/api/audio/Upload').default)
// app.use('/api/temp_files/', serveStatic(upload_path))

const inflections_app = express();
inflections_app.use(cors({ origin: "*" }));
inflections_app.set("json spaces", 2);
inflections_app.use(
  "/inflection_styles.css",
  staticCached(path.join(process.env.PWD, "/build/inflection_styles.css"))
);
inflections_app.use(
  "/",
  require("inflection/server/server-with-database/route_loader").default
);
app.use((req, res, next) => {
  if (
    /inflections\./.exec(req.headers.host) ||
    /\/api\/inflection/.exec(req.originalUrl)
  ) {
    inflections_app(req, res, next);
  } else {
    return next();
  }
});

app.use(mainapp);

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const port = process.env.SERVER_PORT || argv.port || 9123;

/* Import steps */
if (argv["generate-links"]) {
  require("server/compiler/generate_links.js");
} else if (argv["sitemap"]) {
  require("server/compiler/generate_sitemap.js");
} else if (argv["sort_course_chapters"]) {
  require("server/compiler/sort_course_chapters.js");
} else if (argv["prerender"]) {
  require("server/compiler/prerender_all.js");
} else if (argv["import-inflections"] || argv["generate-search-index"]) {
  // require("inflection/server/server-with-database/database/ImportToDatabase.js");
} else if (argv["import-vocabulary"]) {
  require("server/vocabulary/compile");
} else if (argv["generate-sentences"]) {
  require("server/vocabulary/generate_sentences");
} else if (argv["migration_vocabulary_2021_08"]) {
  // require("server/database/migrations/vocabulary_2021_08.js");
} else {
  /* Or, start the app */
  app.listen(port, host, (err) => {
    if (err) {
      return console.error(err.message);
    }
    if (isDev) {
      console.log(`Running on port ${port}`);
      // exec(
      //   `terminal-notifier -group 'ylhyra' -title '🥰🥰🥰' -message 'Server started!'`
      // );
    }
  });
}

process.on("SIGINT", function () {
  process.exit(0);
});

/* Error notifications */
process.on("uncaughtException", (err) => {
  if (isDev) {
    exec(
      `terminal-notifier -group 'ylhyra' -title '⚠️' -message 'Server has crashed'`
    );
  }
  console.error(err);
});
