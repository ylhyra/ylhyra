import removeNullKeys from "app/app/functions/removeNullKeys";
import { msToS } from "app/app/functions/time";
import express from "express";
import stable_stringify from "json-stable-stringify";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";

const router = require("express").Router();

router.get("/vocabulary/session_log_migration", async (req, res) => {
  if (!req.session.session_id && !req.session.user_id) {
    return res.sendStatus(200);
  }

  query(
    sql`
        SELECT 
        UNIX_TIMESTAMP(timestamp) * 1000 as timestamp, 
        seconds_spent
        FROM analytics a
        WHERE 
        (user_id = ${req.session.user_id}
          OR session_id = ${req.session.session_id})
        AND timestamp < "2021-11-28 21:36:32"
        AND type = "vocabulary"
      `, // TODO
    (err, results) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        res.send(results);
      }
    }
  );
});
export default router;
