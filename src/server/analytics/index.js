import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
const router = require("express").Router();
const { Crawler, middleware } = require("es6-crawler-detect");

const rateLimit = require("express-rate-limit")({
  windowMs: 1 * 60 * 1000,
  max: 10,
});

// const MAX_TO_SAVE = 300;

router.post("/a", rateLimit, (req, res) => {
  /* Ignore robots */
  if (new Crawler(req).isCrawler()) {
    return res.sendStatus(200);
  }

  if (!req.session.session_id) {
    req.session.session_id = shortid.generate();
  }

  // req.session.user_id

  /*
    Page views
  */
  query(
    `INSERT INTO interactions SET
    ip = ?,
    browser = ?,
    version = ?,
    os = ?,
    platform = ?,
    is_mobile = ?,
    user_session = ?,
    page_name = ?,
    type = "view",
    country = ?
    `,
    [
      req.clientIp,
      req.useragent.browser,
      req.useragent.version.split(".")[0],
      req.useragent.os,
      req.useragent.platform,
      req.useragent.isMobile,
      req.session.session_id,
      req.body.pageName,
      req.get("CF-IPCountry"),
    ],
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
      }
    }
  );
  res.sendStatus(200);
});

/*
  List most popular pages by unique visitors
*/
router.get("/a", (req, res) => {
  // query(sql`
  //   SELECT
  //     page_name,
  //     SUM(total_views) as total_views,
  //     COUNT(user_session) AS unique_views
  //   FROM interactions AS table1
  //   JOIN  (
  //     SELECT
  //       id,
  //       COUNT(user_session) AS total_views
  //     FROM interactions
  //     WHERE type = "view"
  //     GROUP BY user_session
  //   ) AS table2
  //   ON table1.id = table2.id
  //   WHERE type = "view"
  //   GROUP BY page_name
  //   ORDER BY unique_views DESC
  //   LIMIT 20;
  // `, (err, results) => {
  //   if (err) {
  //     console.error(err)
  //     res.sendStatus(500)
  //   } else {
  //     res.send(results)
  //   }
  // })
});

export default router;
