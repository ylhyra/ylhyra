import generate_html from "documents/compile";
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
    input_url = decodeURI(req.path);
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

    // title = renderTitle(title);

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
      } else if (redirect_to && type === "html") {
        res.redirect(301, encodeURI(redirect_to));
      } else {
        fs.readFile(
          path.resolve(build_folder, `./prerender/${filename}.${type}`),
          "utf8",
          async (err, data) => {
            // Last-Modified:
            // console.log(err);
            if (err) {
              send404html(res);
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
      send404html(res);
    }
  }
});

const send404html = (res) => {
  res
    .status(404)
    .sendFile(path.resolve(build_folder, `./prerender/not-found.html`));
};

export default router;
