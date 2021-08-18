// import 'source-map-support/register'
import "core-js/stable";
import "regenerator-runtime/runtime";
import express from "express";
import bodyParser from "body-parser";
import argvFactory from "minimist";
import query from "./database";
import requestIp from "request-ip";
import path from "path";
import { unprocessed_image_url, processed_image_url } from "paths";
import { ylhyra_content_files, image_output_folder } from "paths_backend";
import { build_folder } from "paths_backend";
import { exec } from "child_process";
import { notifyOfError } from "./errors";
require("source-map-support").install();
require("dotenv").config({ path: "./../.env" });
const argv = argvFactory(process.argv.slice(2));
const app = express();
require("express-ws")(app);
// export const upload_path = path.resolve(__dirname, './../../uploads')
// export const image_path = path.resolve(__dirname, './../output/images')
var cors = require("cors");
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
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

if (!process.env.COOKIE_SECRET) {
  console.warn("Missing COOKIE_SECRET");
}

/* Set Unicode header on all responses */
app.use(function (req, res, next) {
  res.setHeader("charset", "utf-8");
  next();
});

// TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum, t.d. með "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
query(`SET sql_mode = ''`, () => {});
setTimeout(() => {
  query(`SET sql_mode = ''`, () => {});
}, 10000);

app.use(processed_image_url, express.static(image_output_folder));
app.use(unprocessed_image_url, express.static(ylhyra_content_files));
app.use("/", express.static(build_folder));
app.use(
  "/robots.txt",
  express.static(path.join(__basedir, "./public/robots.txt"))
);
// app.use(
//   "/sitemap.xml",
//   express.static(path.join(__basedir, "./build/sitemap.xml"))
// );
/*
  Private APIs
*/
app.use(cors({ origin: "https://ylhyra.is" }));
// app.use('/api', require('server/web-socket').default)
// app.use('/api', require('server/server-side-rendering').default)
app.use("/api", require("server/audio/recorder").default);
// app.use('/api', require('server/audio/GetOneAudioFile').default)
// app.use('/api', require('server/audio/Synchronize').default)
// app.use('/api', require('server/translator/save').default)
app.use("/api", require("server/analytics").default);
app.use("/api", require("server/analytics/overview").default);
app.use("/api", require("server/analytics/userErrors").default);
app.use("/api", require("server/user").default);
app.use("/api", require("server/user/pay").default);
app.use("/api", require("server/vocabulary/get").default);
app.use("/api", require("server/vocabulary/save").default);
app.use("/api", require("server/vocabulary/maker").default);
app.use("/", require("server/content").default);

// // app.use('/api', require('server/tweets').default)
// // app.use('/api', require('server/audio').default)
// // app.use('/api', require('server/translator/Google').default)
// // app.use('/api', require('server/api/audio/Upload').default)

// app.use('/api/temp_files/', express.static(upload_path))

/*
  Public APIs
*/
app.use(cors({ origin: "*" }));
app.set("json spaces", 2);

// const router = require("express").Router();
// router.get(["/robots.txt", "/favicon.ico", "/sitemap.xml"], (req, res) => {
//   res.send("");
// });
// app.use("/", router);

// /*
//   When running on subdomains,
//   serve up inflections.
//   If other services are needed later, go by "request.headers.host"
// */
// app.use(
//   "/inflection_styles",
//   express.static(path.join(__dirname, "/inflection/styles"))
// );
// app.use(
//   "/",
//   require("server/inflection/server/server-with-database/route_loader").default
// );

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || "localhost";
const port = process.env.SERVER_PORT || argv.port || 9123;

/* Import steps */
if (process.argv[2] === "--generate-links") {
  require("server/compiler/generate_links.js");
} else if (process.argv[2] === "--sitemap") {
  require("server/compiler/generate_sitemap.js");
} else if (process.argv[2] === "--sort_course_chapters") {
  require("server/compiler/sort_course_chapters.js");
} else if (process.argv[2] === "--prerender") {
  require("server/content/prerender_all.js");
} else if (process.argv[2] === "--prerender-single") {
  require("server/content/prerender_single.js");
} else if (process.argv[2] === "--import-inflections") {
  // require("server/inflection/server/server-with-database/database/ImportToDatabase.js");
} else if (process.argv[2] === "--generate-search-index") {
  // require("server/inflection/server/server-with-database/database/generateSearchIndex.js");
} else if (process.argv[2] === "--import-vocabulary") {
  require("server/vocabulary/compile");
} else if (process.argv[2] === "--generate-sentences") {
  require("server/vocabulary/generate_sentences");
} else {
  /* Or, start the app */
  app.listen(port, host, (err) => {
    if (err) {
      return notifyOfError(err.message);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(`Running on port ${port}`);
    }
  });
}

process.on("SIGINT", function () {
  process.exit(0);
  // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});

process.on("uncaughtException", (err) => {
  if (process.env.NODE_ENV === "development") {
    exec(
      `terminal-notifier -group 'ylhyra' -title '⚠️' -message 'Server has crashed'`
    );
  } else {
    notifyOfError(err.toString());
  }
  console.error(err);
});
