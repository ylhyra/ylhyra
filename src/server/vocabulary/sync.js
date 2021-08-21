import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { round, msToS, daysToMs, roundMsToHour } from "app/App/functions/time";

const router = require("express").Router();
const fs = require("fs");
router.use("/vocabulary/", express.static(__basedir + "/build/vocabulary"));

const key_value_fields = ["easinessLevel"];

router.post("/vocabulary/sync", async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
  }
  const now = new Date().getTime();
  try {
    const unsyncedScheduleFromServer = await syncSchedule(req);
    const unsyncedSessionsFromServer = await syncSessions(req);
    const unsyncedSettings = await syncSettings(req);
    res.send({
      schedule: unsyncedScheduleFromServer,
      sessions: unsyncedSessionsFromServer,
      ...unsyncedSettings,
      lastSynced: now,
    });
  } catch (e) {
    res.status(400).send(e.toString() || "");
  }
});

const syncSchedule = async (req) => {
  const { schedule } = req.body;
  const unsyncedScheduleFromServer = await getSchedule(req).filter(
    (row) => row.last_seen > (schedule[row.card_id]?.last_seen || 0)
  );
  const unsyncedScheduleFromUser = Object.keys(schedule)
    .map((card_id) => schedule[card_id])
    .filter(
      (row) =>
        !unsyncedScheduleFromServer.find((j) => j.card_id === row.card_id)
    );
  await saveSchedule(req, unsyncedScheduleFromUser);
  return unsyncedScheduleFromServer;
};
const getSchedule = (req) => {
  return new Promise((resolve) => {
    query(
      sql`
        SELECT
          a.card_id,
          a.score,
          a.last_interval_in_days,
          a.sessions_seen,
          UNIX_TIMESTAMP(a.due) * 1000 as due,
          UNIX_TIMESTAMP(a.last_seen) * 1000 as last_seen
        FROM vocabulary_schedule a
        INNER JOIN (
          SELECT max(id) id, card_id FROM vocabulary_schedule
            WHERE user_id = ${req.session.user_id}
            GROUP BY card_id
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
          resolve(results);
        }
      }
    );
  });
};

const saveSchedule = (req, unsyncedScheduleFromUser) => {
  return new Promise((resolve) => {
    if (unsyncedScheduleFromUser.length > 10000) {
      throw new Error("Too long");
    }

    const queries = unsyncedScheduleFromUser.map((item) => {
      if (!item.due) return "";
      // const due_milliseconds = (new Date()).getTime() + daysToMs(card.due_in_days)
      return sql`
        INSERT INTO vocabulary_schedule SET
          user_id = ${req.session.user_id},
          card_id = ${item.card_id},
          due = FROM_UNIXTIME(${msToS(roundMsToHour(item.due))}),
          last_seen = FROM_UNIXTIME(${
            item.last_seen ? msToS(roundMsToHour(item.last_seen)) : null
          }),
          last_interval_in_days = ${item.last_interval_in_days || null},
          score = ${item.score || null},
          sessions_seen = ${item.sessions_seen || null}
          ;
      `;
    });

    query(queries.join(""), (err, results) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        resolve();
      }
    });
  });
};

const syncSessions = async (req) => {
  const { sessions } = req.body;
  const unsyncedSessionsFromServer = await getSessions(req).filter(
    (row) => row.timestamp > (sessions[row.card_id]?.timestamp || 0)
  );
  const unsyncedSessionsFromUser = sessions.filter(
    (row) =>
      !unsyncedSessionsFromServer.find((j) => j.timestamp === row.timestamp)
  );
  await saveSessions(req, unsyncedSessionsFromUser);
  return unsyncedSessionsFromServer;
};

const getSessions = (req) => {
  return new Promise((resolve) => {
    query(
      sql`
        SELECT
          seconds_spent,
          UNIX_TIMESTAMP(created_at) * 1000 as created_at
        FROM vocabulary_sessions
        WHERE user_id = ${req.session.user_id}
        AND created_at > FROM_UNIXTIME(${msToS(req.body.lastSynced) || 0})
        ORDER BY id DESC
      `,
      (err, results) => {
        if (err) {
          console.error(err);
          throw new Error();
        } else {
          resolve(results);
        }
      }
    );
  });
};
const saveSessions = (req, sessions) => {
  return new Promise((resolve) => {
    if (sessions.length > 1000) {
      throw new Error("Too long");
    }

    const queries = sessions.map((item) => {
      return sql`
        INSERT INTO vocabulary_sessions SET
          user_id = ${req.session.user_id},
          seconds_spent = ${item.seconds_spent},
          created_at = FROM_UNIXTIME(${msToS(roundMsToHour(item.due))}),
          ;
      `;
    });

    query(queries.join(""), (err, results) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        resolve();
      }
    });
  });
};

const syncSettings = async (req) => {
  const unsyncedFromServer = await getSettings(req);
  let unsyncedFromUser = {};
  key_value_fields.forEach((name) => {
    if (!(name in unsyncedFromServer) && name in req.body) {
      unsyncedFromUser[name] = req.body.name;
    }
  });
  await saveSessions(req, unsyncedFromUser);
  return unsyncedFromServer;
};
const getSettings = (req) => {
  return new Promise((resolve) => {
    const queries = key_value_fields.map(
      (name) => sql`
        SELECT name, value
        FROM user_settings a
        INNER JOIN (
          SELECT max(id) id, name FROM user_settings
            WHERE user_settings = ${req.session.user_id}
            GROUP BY name
        ) b
        ON a.id = b.id
        WHERE user_id = ${req.session.user_id}
        AND name = ${name}
        AND created_at > FROM_UNIXTIME(${msToS(req.body.lastSynced) || 0})
    `
    );
    query(queries, (err, results) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        let obj = {};
        results.forEach((row) => {
          obj[row.name] = row.value;
        });
        resolve(obj);
      }
    });
  });
};
const saveSettings = (req, unsyncedFromUser) => {
  return new Promise((resolve) => {
    const queries = key_value_fields
      .map((key) => {
        const value = unsyncedFromUser[key];
        if (!value) return null;
        return sql`
          INSERT INTO user_settings SET
            user_id = ${req.session.user_id},
            name = ${key},
            value = ${value}
            ;
        `;
      })
      .filter(Boolean);

    if (queries.length === 0) {
      return resolve();
    }

    query(queries.join(""), (err, results) => {
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
