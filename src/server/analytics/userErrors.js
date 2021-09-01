import { notifyOfError } from "server/errors";
const router = require("express").Router();
const { Crawler } = require("es6-crawler-detect");

const rateLimit = require("express-rate-limit")({
  windowMs: 5 * 60 * 1000,
  max: 1,
});

router.post("/error", rateLimit, (req, res) => {
  if (process.env.NODE_ENV === "development") return res.sendStatus(200);

  /* Ignore robots */
  if (new Crawler(req).isCrawler()) {
    return res.sendStatus(200);
  }

  if (!req.body.message) {
    return res.sendStatus(400);
  }

  notifyOfError(`
    User ${req.session.username || ""}
    from ${req.get("CF-IPCountry") || ""}
    had an error: «${req.body.message}»
    on ${req.body.url}
  `);

  res.sendStatus(200);
});
export default router;
