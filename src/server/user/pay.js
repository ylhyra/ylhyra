import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import stable_stringify from "json-stable-stringify";
import send_email from "server/user/send_email";
import sha256 from "js-sha256";
import request from "request";
// import { hash as argon_hash, verify as argon_verify } from 'argon2'
const argon2 = require("argon2");
const argon_hash = argon2.hash;
const argon_verify = argon2.verify;
const router = require("express").Router();
const key = process.env.COOKIE_SECRET || "secret";
var crypto = require("crypto");
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
      username = ${user_id || "session_" + req.session.session_id},
      price = ${price},
      transaction_id = ${transaction_id},
      type = "pwyw"
      `,
    (err, results) => {
      res.sendStatus(200);
    }
  );
});

export default router;
