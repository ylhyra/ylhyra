import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
const router = require("express").Router();
const fs = require("fs");
export const vocabulary_json = __basedir + "/build/vocabulary_database.json";

router.post("/vocabulary/sync", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
  }
  const now = new Date().getTime();

  query(
    sql`
      SELECT a.*,
        UNIX_TIMESTAMP(a.due) * 1000 as due,
        UNIX_TIMESTAMP(a.adjusted_due) * 1000 as adjusted_due,
        UNIX_TIMESTAMP(a.last_seen) * 1000 as last_seen
      FROM vocabulary_schedule a
      INNER JOIN (
        SELECT max(id) id, card_id FROM vocabulary_schedule
          WHERE user_id = ${req.session.user_id}
          GROUP BY card_id
      ) b
      ON a.id = b.id
      WHERE user_id = ${req.session.user_id}
      ORDER BY id DESC
  `,
    (err, results) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

router.use("/vocabulary/", express.static(__basedir + "/build/vocabulary"));

export default router;
