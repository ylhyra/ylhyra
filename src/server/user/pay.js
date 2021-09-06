// import { hash as argon_hash, verify as argon_verify } from 'argon2'
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";

const router = require("express").Router();
const speedLimit = require("express-slow-down")({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5,
  delayMs: 300,
});

/* Payments */
router.post("/pwyw", speedLimit, async (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) return res.status(400).send("Not logged in");

  const { price, transaction_id } = req.body;
  query(
    sql`INSERT INTO payments SET
      user_id = ${user_id || "session_" + req.session.session_id},
      price = ${price},
      transaction_id = ${transaction_id},
      type = "pwyw"
      `,
    () => {
      res.sendStatus(200);
    }
  );
});

export default router;
