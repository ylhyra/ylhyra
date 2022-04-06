import { Request, Response, Router } from "express";
import fs from "fs";
import { isDev } from "modules/isDev";
import path from "path";
import generateHtml from "ylhyra/documents/compilation/compileDocument";
import { getValuesForUrl } from "ylhyra/documents/compilation/links/getValuesForUrl.server";
import { addBuildIds } from "ylhyra/documents/get/addBuildIds.server";
import { LinkDataWithUrl } from "ylhyra/documents/types";
import { cacheControl } from "ylhyra/server/caching";
import { buildFolder, getBaseDir } from "ylhyra/server/paths";

const router = Router({ strict: true });

router.get(["/robots.txt"], async (req, res) => {
  if (req.subdomains.includes("test")) {
    res.send("User-agent: *\nDisallow: /");
  } else {
    res.sendFile(path.join(getBaseDir(), "./src/app/app/public/robots.txt"));
  }
});

router.get(
  ["/api/content", "*"],
  async (
    req: Request<
      {},
      {},
      {},
      {
        title?: string;
        clientSideRendering?: Boolean;
      }
    >,
    res
  ) => {
    let inputUrl: string;
    let type: "html" | "json" = "html";
    if (req.query.title) {
      inputUrl = req.query.title;
      type = "json";
    } else {
      inputUrl = decodeURI(req.path);
    }
    let values = getValuesForUrl(inputUrl);
    let redirect_to;
    if (
      values.url &&
      // @ts-ignore
      inputUrl.replaceAll("/", "") !== values.url.replaceAll("/", "")
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
      let { title, filepath, filename, url } = values as LinkDataWithUrl;

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
          const { content, header } = await generateHtml(url);
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
          /** Send prerendered */
          fs.readFile(
            path.resolve(buildFolder, `./prerender/${filename}.${type}`),
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
  }
);

const send404html = (res: Response) => {
  fs.readFile(
    path.resolve(buildFolder, `./prerender/not-found.html`),
    "utf8",
    async (err, data) => {
      return res.status(404).send(addBuildIds(data));
    }
  );
};

export default router;
