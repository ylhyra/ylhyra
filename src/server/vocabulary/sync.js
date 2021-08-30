import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { round, msToS, daysToMs, roundMsToHour } from "app/App/functions/time";
import stable_stringify from "json-stable-stringify";
import removeNullKeys from "app/App/functions/removeNullKeys.js";
import { now } from "app/App/functions/time.js";

const router = require("express").Router();
const fs = require("fs");

/* Download vocabulary database file */
router.use("/vocabulary/", express.static(__basedir + "/build/vocabulary"));

/* Sync user data*/
router.post("/vocabulary/sync", async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
  }
  try {
    const unsyncedFromServer = await getUserData(req);
    const unsyncedFromUser = Object.keys(req.body.unsynced).map((key) => ({
      key,
      ...req.body.unsynced[key],
    }));
    // // Filter based on time?
    // .filter(item=>{
    // })
    await saveUserData(req, unsyncedFromUser);
    res.send({
      user_data: unsyncedFromServer || {},
      lastSynced: now(),
    });
  } catch (e) {
    if (typeof e !== "string") {
      console.error(e);
    }
    res.status(400).send(e.toString() || "");
  }
});

const getUserData = (req) => {
  return new Promise((resolve) => {
    query(
      sql`
        SELECT
          a.key,
          a.value
        FROM user_data a
        INNER JOIN (
          SELECT max(id) id, \`key\` FROM user_data
            WHERE user_id = ${req.session.user_id}
            GROUP BY \`key\`
        ) b
        ON a.id = b.id
        WHERE user_id = ${req.session.user_id}
        AND created_at > FROM_UNIXTIME(${msToS(req.body.lastSynced) || 0})
      `,
      (err, results) => {
        if (err) {
          console.error(err);
          throw new Error();
        } else {
          let out = {};
          results.forEach(({ key, value }) => {
            out[key] = {
              value: JSON.parse(value),
            };
          });
          resolve(out);
        }
      }
    );
  });
};

const saveUserData = (req, unsyncedScheduleFromUser) => {
  return new Promise((resolve) => {
    if (unsyncedScheduleFromUser.length > 10000) {
      throw new Error("Too long");
    }

    const queries = unsyncedScheduleFromUser
      .map((item) => {
        if (!item.due) return "";
        return sql`
          INSERT INTO user_data SET
            user_id = ${req.session.user_id},
            key = ${item.card_id},
            value = ${stable_stringify(removeNullKeys())}
            ;
        `;
      })
      .join("");

    if (!queries) return resolve();

    query(queries, (err, results) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        resolve();
      }
    });
  });
};

export default router;
