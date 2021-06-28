import generate_html from "documents/Compile";
import { URL_title, FileSafeTitle } from "paths.js";
import { removeComments } from "documents/Compile/transclude";
import { url_to_info } from "app/Router/paths.js";
const router = require("express").Router();
var fs = require("fs");
let links = {};
try {
  links = require("build/links.js");
} catch (e) {}
const yaml = require("js-yaml");
const path = require("path");
const build_folder = path.resolve(__basedir, `./build`);

router.get(["/api/content", "*"], async (req, res) => {
  let url;
  let type = "html";
  if ("title" in req.query) {
    url = URL_title(req.query.title);
    type = "json";
  } else {
    url = URL_title(req.path);
  }
  let values = links[url];
  if (values || url_to_info["/" + url]) {
    let output = {};
    let title, file, filename;
    if (values) {
      title = values.title;
      file = values.file;
      filename = values.filename;
      if (values.redirect_to) {
        url = values.redirect_to;
        file = links[values.redirect_to].file;
        title = links[values.redirect_to].title;
        filename = links[values.redirect_to].filename;
        output.redirect_to = values.redirect_to;
        output.section = values.section;
      } else if (req.query.title !== url) {
        output.redirect_to = url;
      }
    } else {
      title = "";
      filename = FileSafeTitle(url);
    }

    title = title.split(/[/:]/g).reverse().join("\u2006•\u2006");

    if (url.startsWith("file/")) {
      res.sendFile(file.replace(/(\.[a-z]+)$/i, ""));
    } else {
      /* Client side rendering allowed in development */
      if (process.env.NODE_ENV === "development" && type === "json") {
        const { content, header } = await generate_html(url);
        if ("html" in req.query) {
          return res.send(content);
        }
        res.send({
          ...output,
          content,
          title,
          header,
        });
      } else {
        fs.readFile(
          path.resolve(build_folder, `./prerender/${filename}.${type}`),
          "utf8",
          async (err, data) => {
            if (err) {
              send404(res);
            } else {
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
      send404(res);
    }
  }
});

const send404 = (res) => {
  res
    .status(404)
    .sendFile(path.resolve(build_folder, `./prerender/not-found.html`));
};

export default router;

export const ParseHeaderAndBody = (data, file) => {
  data = removeComments(data);
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
  if (!match) {
    throw new Error("Failed to parse\n\n" + data);
    return;
  }
  let [j, header, body] = match;

  let output = {};
  // header = header.replace(/: (.+):/g, ': $1\\:')
  header = yaml.load(header);
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + data);
    return;
  }

  if (!header.level && /\/[abc][123]\//i.test(file)) {
    header.level = file.match(/\/([abc][123])\//i)[1].toUpperCase();
  }

  return { header, body };
};
