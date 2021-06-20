import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
const router = require("express").Router();
const fs = require("fs");
export const vocabulary_json =
  __basedir + "/build/vocabulary_database.json";

router.all(
  "/vocabulary/get",
  /* cors({ origin: 'https://ylhyra.is', credentials: true }),*/ (req, res) => {
    /* Temp */
    // let user_id = req.body.user_id || shortid.generate()
    // res.setHeader('user_id', user_id) /* Temp */
    query(
      sql`
    SELECT * FROM vocabulary_cards
    ORDER BY level, sort
    LIMIT 200
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
  }
);

router.use(
  "/vocabulary/vocabulary_database.json",
  express.static(vocabulary_json)
);
router.get("/vocabulary/database_last_updated", (req, res) => {
  fs.stat(vocabulary_json, (err, stats) => {
    if (err) {
      throw err;
    }
    res.send(new Date(stats.mtime).getTime().toString());
  });
});

/* Get schedule */
router.post("/vocabulary/schedule", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
  }
  query(
    sql`
    SELECT *,
      UNIX_TIMESTAMP(due) * 1000 as due,
      UNIX_TIMESTAMP(last_seen) * 1000 as last_seen
      FROM vocabulary_schedule
    WHERE user_id = ${req.session.user_id}
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

export default router;
