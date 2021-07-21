/**
 * Saves session and updates schedule
 */
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { round, msToS, daysToMs, roundMsToHour } from "app/App/functions/time";
const router = require("express").Router();

router.post("/vocabulary/save", cors(), (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) return res.status(400).send("Not logged in");

  const schedule = req.body.schedule;

  if (Object.keys(schedule).length > 10000) {
    return res.status(400).send("Too long");
  }

  const queries = Object.keys(schedule).map((id) => {
    const item = schedule[id];
    if (!item.due) return "";
    // const due_milliseconds = (new Date()).getTime() + daysToMs(card.due_in_days)

    return sql`
      DELETE FROM vocabulary_schedule
        WHERE card_id = ${id}
        AND user_id = ${user_id}
        ;
      INSERT INTO vocabulary_schedule SET
        card_id = ${id},
        due = FROM_UNIXTIME(${msToS(roundMsToHour(item.due))}),
        last_seen = FROM_UNIXTIME(${
          item.last_seen ? msToS(roundMsToHour(item.last_seen)) : null
        }),
        last_interval_in_days = ${item.last_interval_in_days || null},
        user_id = ${user_id},
        score = ${item.score || null},
        sessions_seen = ${item.sessions_seen || null}
        ;
    `;
  });

  query(queries.join(""), (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send("GOOD");
    }
  });
});

export default router;
