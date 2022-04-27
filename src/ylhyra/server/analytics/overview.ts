import { Router } from "express";
import { isDev } from "modules/isDev";
import { c } from "modules/noUndefinedInTemplateLiteral";
import { days } from "modules/time";
import query from "ylhyra/server/database";

const router = Router();

router.get("/api/analytics", async (req, res) => {
  if (!isDev && req.session!.username !== "egill") {
    return res.sendStatus(200);
  }
  let html = "";

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

const CountUniqueVisitors = ({ daysBack }: { daysBack?: number }) => {
  return new Promise((resolve) => {
    query(
      `
        SELECT COUNT(*) as count FROM (
          ${distinctIds(daysBack)}
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

const CountUsers = ({ daysBack }: { daysBack?: number }) => {
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
router.get("/api/a", () => {
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

const getDaysBackAsUnixDate = (daysBack?: number) => {
  if (daysBack)
    return `FROM_UNIXTIME(${(new Date().getTime() - daysBack * days) / 1000})`;
  else return `FROM_UNIXTIME(0)`;
};

const distinctIds = (daysBack?: number) => `
  SELECT
    DISTINCT(IFNULL(unique_sessions.user_id, unique_sessions.session_id)) distinct_id
    FROM (
      -- Get list of uniqe session_ids and their last associated user_id
      SELECT a3.user_id, a2.session_id FROM
        (
          SELECT DISTINCT(session_id) as session_id FROM analytics
          WHERE timestamp > ${getDaysBackAsUnixDate(daysBack)}
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
