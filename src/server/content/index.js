import generate_html from "documents/Compile";
import { URL_title } from "paths.js";
const router = require("express").Router();
var fs = require("fs");

let links = {};
try {
  links = require("build/links.js");
} catch (e) {}
const yaml = require("js-yaml");

router.get("/content", async (req, res) => {
  let url = URL_title(req.query.title);
  let values = links[url];
  if (values) {
    let output = {};
    let title = values.title;
    let file = values.file;
    if (values.redirect_to) {
      url = values.redirect_to;
      file = values.file;
      title = links[values.redirect_to].title;
      output.redirect_to = values.redirect_to;
      output.section = values.section;
    } else if (req.query.title !== url) {
      output.redirect_to = url;
    }

    title = title.split(/[/:]/g).reverse().join("\u2006•\u200A");

    if (url.startsWith("file/")) {
      res.sendfile(file.replace(/(\.[a-z]+)$/i, ""));
      // res.sendfile(file)
    } else {
      // console.log(info)
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
    }
  } else {
    return res.sendStatus(404);
  }
});

export default router;

export const ParseHeaderAndBody = (data) => {
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

  return { header, body };
};
