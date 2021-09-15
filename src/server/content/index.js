import generate_html from "documents/compile";
import { URL_title } from "app/app/paths";
import { getValuesForURL } from "server/content/links";
import { build_folder } from "server/paths_backend";
import { isDev } from "app/app/functions/isDev";

const router = require("express").Router({ strict: true });
var fs = require("fs");

const path = require("path");

router.get(["/api/content", "*"], async (req, res) => {
  let input_url;
  let type = "html";
  if ("title" in req.query) {
    input_url = req.query.title;
    type = "json";
  } else {
    input_url = "/" + req.path;
  }
  let values = getValuesForURL(input_url);
  let redirect_to = values.url && input_url !== values.url ? values.url : null;

  /* Turn off indexing for testing site */
  if (req.subdomains.includes("test")) {
    res.set("X-Robots-Tag", "noindex,nofollow");
  } else if (values?.shouldBeIndexed) {
    res.set("X-Robots-Tag", "index,noimageindex");
  } else {
    res.set("X-Robots-Tag", "noindex");
  }

  if (values?.filename) {
    let { title, filepath, filename, url } = values;

    title = title
      ?.split(/[/:]/g)
      .reverse()
      // Ignore parts that are just numbers (such as "/article/1/")
      .filter((i) => !/^\d+$/.test(i))
      .join("\u2006•\u2006");

    if (!isDev) {
      res.set(
        "Cache-Control",
        `public, max-age=${24 * 60 * 60 /* Einn dagur */}`
      );
    }

    // console.log(url);

    if (url.startsWith("/file/")) {
      // console.log(filepath);
      res.sendFile(
        filepath.replace(/(\.[a-z]+)$/i, "") // Fjarlægir ".md"
      );
    } else {
      /* Client side rendering allowed in development */
      if (isDev && type === "json" && values.filepath) {
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
      } else {
        /* TODO!!! Redirect */
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
