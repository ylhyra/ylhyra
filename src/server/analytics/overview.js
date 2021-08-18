import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import _ from "underscore";
import tableify from "tableify";
import c from "app/App/functions/no-undefined-in-template-literal";
import {
  round,
  msToS,
  daysToMs,
  roundMsToHour,
  days,
} from "app/App/functions/time";
const router = require("express").Router();
router.get("/analytics", async (req, res) => {
  if (
    process.env.NODE_ENV !== "development" &&
    !req.session.user_name === "egill"
  ) {
    return res.sendStatus(200);
  }
  let html = "";

  html += await CountPayments({ daysBack: 1 });
  html += await CountPayments({ daysBack: 7 });
  html += await CountPayments({ daysBack: 30 });
  html += "<hr/>";
  html += await CountUsers({ daysBack: 1 });
  html += await CountUsers({ daysBack: 7 });
  html += await CountUsers({ daysBack: 30 });
  html += await CountUsers({});
  html += "<hr/>";
  html += await CountUniqueVisitors({ daysBack: 1 });
  html += await CountUniqueVisitors({ daysBack: 7 });
  html += await CountUniqueVisitors({ daysBack: 30 });

  res.send(html);
});

const CountPayments = async ({ daysBack, active }) => {
  return new Promise((resolve) => {
    query(
      c`
      SELECT SUM(price) as price FROM payments
      WHERE created_at > ${getDaysBack(daysBack)}
    `,
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          // resolve(tableify(results));
          resolve(
            c`$${results[0]?.price || 0} received ${
              daysBack ? `in the last ${daysBack} days` : `overall`
            }<br/>`
          );
        }
      }
    );
  });
};

const CountUniqueVisitors = async ({ daysBack, active }) => {
  return new Promise((resolve) => {
    query(
      `
        SELECT COUNT(*) as count FROM (
          ${distinct_ids(daysBack)}
        ) distinct_ids
    `,
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          // resolve(tableify(results));
          resolve(
            c`${results[0]?.count} unique visitors  ${
              daysBack ? `in the last ${daysBack} days` : `overall`
            }<br/>`
          );
        }
      }
    );
  });
};

const CountUsers = async ({ daysBack, active }) => {
  return new Promise((resolve) => {
    query(
      c`
      SELECT COUNT(id) as count FROM users
      ${
        daysBack &&
        `WHERE created_at > FROM_UNIXTIME(${
          (new Date().getTime() - daysBack * days) / 1000
        })`
      }
    `,
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          // resolve(tableify(results));
          resolve(
            c`${results[0]?.count} users created  ${
              daysBack ? `in the last ${daysBack} days` : `overall`
            }<br/>`
          );
        }
      }
    );
  });
};

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

const getDaysBack = (i) => {
  if (i)
    return `
  FROM_UNIXTIME(${(new Date().getTime() - i * days) / 1000})`;
  else return `FROM_UNIXTIME(0)`;
};

const distinct_ids = (daysBack) => `
  SELECT
    DISTINCT(IFNULL(unique_sessions.user_id, unique_sessions.session_id)) distinct_id
    FROM (
      -- Get list of uniqe session_ids and their last associated user_id
      SELECT a3.user_id, a2.session_id FROM
        (
          SELECT DISTINCT(session_id) as session_id FROM analytics
          WHERE timestamp > ${getDaysBack(daysBack)}
        ) a2
        -- Get last associated user_id
        LEFT JOIN analytics a3
          ON a3.id = (
            SELECT id
            FROM analytics a4
            WHERE a4.session_id = a2.session_id
              AND a3.user_id IS NOT NULL
              ORDER BY id
            LIMIT 1
          )
    ) unique_sessions
`;
