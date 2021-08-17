import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
const router = require("express").Router();
const { Crawler, middleware } = require("es6-crawler-detect");

const rateLimit = require("express-rate-limit")({
  windowMs: 1 * 60 * 1000,
  max: 3,
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

  // ip = ${req.clientIp},

  if (!req.body.queue) {
    return res.sendStatus(400);
  }

  req.body.queue.forEach?.((entry) => {
    /*
      Page views
    */
    query(
      sql`INSERT INTO analytics SET
          user_id = ${req.session.user_id},
          session_id = ${req.session.session_id},
          country = ${req.get("CF-IPCountry")}
          interaction_type = ${entry?.interaction_type},
          page_name = ${entry?.url},
          seconds_spent = ${entry?.seconds},
          referrer = ${entry?.referrer}
        `,
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
        }
      }
    );
  });

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
