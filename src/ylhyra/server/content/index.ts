import hash from "ylhyra/app/app/functions/hash";
import { isDev } from "ylhyra/app/app/functions/isDev";

import generate_html from "ylhyra/documents/compile";
import fs from "fs";
import path from "path";
import { cacheControl } from "ylhyra/server/caching";
import { getValuesForURL } from "ylhyra/server/content/links";
import { build_folder } from "ylhyra/server/paths_backend";

const router = require("express").Router({ strict: true });

router.get(["/robots.txt"], async (req, res) => {
  if (req.subdomains.includes("test")) {
    res.send("User-agent: *\nDisallow: /");
  } else {
    res.sendFile(path.join(__basedir, "./src/app/app/public/robots.txt"));
  }
});

router.get(["/api/content", "*"], async (req, res) => {
  let input_url;
  let type = "html";
  if ("title" in req.query) {
    input_url = req.query.title;
    type = "json";
  } else {
    input_url = decodeURI(req.path);
  }
  let values = getValuesForURL(input_url);
  let redirect_to;
  if (
    values.url &&
    input_url.replaceAll("/", "") !== values.url.replaceAll("/", "")
  ) {
    redirect_to = values.url;
  }

  /* Turn off indexing for testing site */
  if (req.subdomains.includes("test")) {
    res.set("X-Robots-Tag", "noindex,nofollow");
  } else if (values?.shouldBeIndexed) {
    res.set("X-Robots-Tag", "index,noimageindex");
  } else {
    res.set("X-Robots-Tag", "noindex");
  }

  cacheControl(res, "html");

  if (values?.filename) {
    let { title, filepath, filename, url } = values;

    if (url.startsWith("/file/")) {
      cacheControl(res, "immutable");
      res.sendFile(
        filepath.replace(/(\.[a-z]+)$/i, "") // Fjarlægir ".md"
      );
    } else {
      /* Client side rendering allowed in development */
      if (
        req.query.clientSideRendering &&
        isDev &&
        type === "json" &&
        values.filepath
      ) {
        const { content, header } = await generate_html(url);
        if ("html" in req.query) {
          return res.send(content);
        }
        res.send({
          ...values,
          redirect_to,
          content,
          title,
          header,
        });
        `+`;
      }
      // else if (redirect_to && type === "html" && input_url !== "/frontpage") {
      //   res.redirect(301, encodeURI(redirect_to));
      // }
      else {
        fs.readFile(
          path.resolve(build_folder, `./prerender/${filename}.${type}`),
          "utf8",
          async (err, data) => {
            // Last-Modified:
            // console.log(err);
            if (err) {
              send404html(res);
            } else {
              if (type === "html") {
                data = addBuildIds(data);
              }
              return res.send(data);
            }
          }
        );
      }
    }
  } else {
    if (type === "json") {
      return res.sendStatus(404);
    } else {
      send404html(res);
    }
  }
});

const send404html = (res) => {
  fs.readFile(
    path.resolve(build_folder, `./prerender/not-found.html`),
    "utf8",
    async (err, data) => {
      return res.status(404).send(addBuildIds(data));
    }
  );
};

export default router;

const fileHash = (file) => {
  try {
    return hash(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return "";
  }
};
const css_hash = fileHash(path.resolve(build_folder, `./app/main.css`));
const js_hash = fileHash(path.resolve(build_folder, `./app/ylhyra.main.js`));
const voc_hash = fileHash(
  path.resolve(build_folder, `./vocabulary/vocabulary_database.json`)
);
const addBuildIds = (data) => {
  return data
    .replace('ylhyra.main.js"', `ylhyra.main.js?v=${js_hash}"`)
    .replace('app/main.css"', `app/main.css?v=${css_hash}"`)
    .replace(
      'meta name="vocabulary_id" content=""',
      `meta name="vocabulary_id" content="${voc_hash}"`
    );
};
