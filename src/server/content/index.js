import generate_html from "documents/Compile";
import { URL_title, FileSafeTitle } from "paths";
import { removeComments } from "documents/Compile/transclude";
import { url_to_info } from "app/Router/paths";
import { ParseHeaderAndBody } from "documents/Compile/functions/ParseHeaderAndBody";
import { getValuesForURL } from "server/content/links";
import { build_folder } from "paths_backend";
const router = require("express").Router({ strict: true });
var fs = require("fs");

const yaml = require("js-yaml");
const path = require("path");

router.get(["/api/content", "*"], async (req, res) => {
  let url;
  let type = "html";
  if ("title" in req.query) {
    url = URL_title(req.query.title);
    type = "json";
  } else {
    url = URL_title(req.path);
  }
  let values = getValuesForURL(url, req.query.title);

  if (values?.filename) {
    let { title, file, filename } = values;

    title = title.split(/[/:]/g).reverse().join("\u2006•\u2006");

    res.set(
      "Cache-Control",
      `public, max-age=${24 * 60 * 60 /* Einn dagur */}`
    );

    if (url.startsWith("/file/")) {
      // console.log(file);
      res.sendFile(
        file
          .replace(/(\.[a-z]+)$/i, "") // Fjarlægir ".md"
          .replace(
            /^.+ylhyra_content/,
            path.resolve(process.env.PWD, "./../ylhyra_content")
          )
      );
    } else {
      /* Client side rendering allowed in development */
      if (
        process.env.NODE_ENV === "development" &&
        type === "json" &&
        values.filepath
      ) {
        const { content, header } = await generate_html(url);
        if ("html" in req.query) {
          return res.send(content);
        }
        res.send({
          ...values,
          content,
          title,
          header,
        });
      } else {
        fs.readFile(
          path.resolve(build_folder, `./prerender/${filename}.${type}`),
          "utf8",
          async (err, data) => {
            // Last-Modified:
            // console.log(err);
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
