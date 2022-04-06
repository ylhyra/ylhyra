// import 'source-map-support/register'
import { exec } from "child_process";
import "core-js/stable";
import cors from "cors";
import express from "express";
import argvFactory from "minimist";
import { isDev } from "modules/isDev";
import path from "path";
import "regenerator-runtime/runtime";
import requestIp from "request-ip";
import { staticCached } from "ylhyra/server/caching";
import {
  processedImageUrl,
  unprocessedImageUrl,
} from "ylhyra/content/content/links/paths";
import query from "ylhyra/server/database";
import {
  buildFolder,
  getBaseDir,
  imageOutputFolder,
  ylhyraContentFiles,
} from "ylhyra/server/paths.server";

require("source-map-support").install();
require("dotenv").config({ path: "./../.env" });

const argv = argvFactory(process.argv.slice(2));

const app = express();
require("express-ws")(app);
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

const ylhyraApp = express();
ylhyraApp.use(processedImageUrl, staticCached(imageOutputFolder));
ylhyraApp.use(unprocessedImageUrl, staticCached(ylhyraContentFiles));
ylhyraApp.use("/", staticCached(buildFolder));

/*
  Private APIs
*/
ylhyraApp.use(cors({ origin: "https://ylhyra.is" }));
// app.use('/api', require('server/server-side-rendering').default)
ylhyraApp.use("/api", require("ylhyra/server/audio/recorder").default);
// app.use('/api', require('server/audio/GetOneAudioFile').default)
// app.use('/api', require('server/audio/Synchronize').default)
// app.use('/api', require('server/translator/save').default)
ylhyraApp.use(
  "/api",
  require("ylhyra/content/translationEditor/main/saveTranslationData.server")
    .default
);
ylhyraApp.use("/api", require("ylhyra/server/analytics").default);
ylhyraApp.use("/api", require("ylhyra/server/analytics/overview").default);
ylhyraApp.use("/api", require("ylhyra/server/analytics/userErrors").default);
ylhyraApp.use("/api", require("ylhyra/server/user").default);
ylhyraApp.use("/api", require("ylhyra/server/user/pay").default);
ylhyraApp.use(
  "/",
  require("ylhyra/vocabulary/app/actions/userData/sync.server").default
);
ylhyraApp.use(
  "/",
  require("ylhyra/vocabulary/vocabularyEditor/vocabularyEditor.server").default
);
ylhyraApp.use("/", require("ylhyra/content/content").default);

const inflections_app = express();
inflections_app.use(cors({ origin: "*" }));
inflections_app.set("json spaces", 2);
inflections_app.use(
  "/inflection_styles.css",
  staticCached(path.join(getBaseDir(), "/build/inflection_styles.css"))
);
inflections_app.use("/", require("inflection/server/routes/api").default);
inflections_app.use("/", require("inflection/server/routes/website").default);
app.use((req, res, next) => {
  if (
    /inflections\./.exec(req.headers.host || "") ||
    /\/api\/inflection/.exec(req.originalUrl)
  ) {
    inflections_app(req, res, next);
  } else {
    return next();
  }
});

app.use(ylhyraApp);

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const port = process.env.SERVER_PORT || argv.port || 9123;

/* Import steps */
if (argv["generate-links"]) {
  require("ylhyra/content/content/links/generateLinks.js");
} else if (argv["sitemap"]) {
  require("ylhyra/content/content/prerender/generateSitemap.js");
} else if (argv["sort_course_chapters"]) {
  require("ylhyra/content/content/preProcessing/sortCourseChapters.js");
} else if (argv["prerender"]) {
  require("ylhyra/content/content/prerender/prerenderAll.js");
} else if (argv["generate-search-index"]) {
  require("inflection/server/database/generateSearchIndex");
} else if (argv["import-inflections"]) {
  require("inflection/server/database/importToDatabase");
} else if (argv["import-vocabulary"]) {
  require("ylhyra/vocabulary/compiler/compile");
} else if (argv["generate-sentences"]) {
  require("ylhyra/vocabulary/compiler/scripts/findEasySentencesFromCorpus");
} else {
  /* Or, start the app */
  app.listen(port, host, () => {
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
