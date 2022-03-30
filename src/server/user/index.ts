import argon2 from "argon2";
import { encodeDataInHtml } from "documents/compile/functions/functions";
import request from "request";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";

const argon_hash = argon2.hash;
const argon_verify = argon2.verify;
const router = require("express").Router();
const speedLimit = require("express-slow-down")({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5,
  delayMs: process.env.TESTING ? 0 : 700,
});

const rateLimit = require("express-rate-limit")({
  windowMs: 1 * 60 * 1000,
  max: process.env.TESTING ? Infinity : 5,
});

router.post("/user", speedLimit, rateLimit, async (req, res) => {
  let username = req.body.username?.trim().replace(/\s+/g, " ");
  const email = req.body.email?.trim();
  const { password, captcha_token, type } = req.body;

  if (!username) {
    return res.send({ error: "ERROR_USERNAME_REQUIRED" });
  }
  if (!password) {
    return res.send({ error: "ERROR_PASSWORD_REQUIRED" });
  }

  captcha(captcha_token, res, async () => {
    let user_id, user, did_user_exist;
    if (type === "login") {
      user = await get_user({ username, password, res });
      username = user.username;
      user_id = user.id;
      did_user_exist = true;
    } else if (type === "signup") {
      /* Check if username is valid */
      if (/@/.test(username)) {
        return res.send({ error: "ERROR_INVALID_USERNAME" });
      }

      /* Check if username or email already exists */
      const error = await check_if_user_exists({ email, username });
      if (error) return res.send({ error });

      user_id = await create_user({ email, username, password, res });
    }

    req.session.user_id = user_id;
    req.session.username_encoded = encodeDataInHtml(username, true);
    return res.send({ user_id, username, did_user_exist });
  });
});

const get_user = async ({ username, password, res }) => {
  return new Promise((resolve) => {
    query(
      sql`SELECT * FROM users WHERE
      username = ${username} OR
      email = ${username}
    `,
      (err, results) => {
        if (results.length > 0) {
          const row = results[0];
          if (!argon_verify(row.password, password)) {
            return res.send({ error: "ERROR_INCORRECT_PASSWORD" });
          }
          resolve(row);
        } else {
          return res.send({ error: "ERROR_USERNAME_DOES_NOT_EXIST" });
        }
      }
    );
  });
};

/*
  Returns "ERROR_USERNAME_EXISTS" or "ERROR_EMAIL_ALREADY_IN_USE"
*/
const check_if_user_exists = async ({ email, username }) => {
  return new Promise((resolve) => {
    let q;
    if (email) {
      q = sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
    } else {
      q = sql`SELECT * FROM users WHERE username = ${username}`;
    }
    query(q, (err, results) => {
      if (results.length > 0) {
        if (email && results[0].email.toLowerCase() === email.toLowerCase()) {
          return resolve("ERROR_EMAIL_ALREADY_IN_USE");
        } else {
          return resolve("ERROR_USERNAME_EXISTS");
        }
      }
      return resolve(null);
    });
  });
};

const create_user = ({ username, email, password, res }) => {
  return new Promise(async (resolve) => {
    const hash = await argon_hash(password);
    query(
      sql`INSERT INTO users SET
      username = ${username},
      email = ${email || null},
      password = ${hash}
      `,
      (err, results2) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(500).send({ error: "ERROR_USER_ALREADY_EXIST" });
          }
          return res.sendStatus(500);
        } else {
          resolve(results2.insertId);
        }
      }
    );
  });
};

const captcha = (captcha_token, res, callback) => {
  if (!process.env.REACT_APP_HCAPTCHA_SITEKEY) {
    return callback();
  }
  if (!captcha_token) {
    return res.send({ error: "ERROR_INCORRECT_CAPTCHA" });
  }
  request.post(
    {
      url: "https://hcaptcha.com/siteverify",
      form: {
        response: captcha_token,
        secret: process.env.HCAPTCHA_SECRET,
      },
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      } else if (JSON.parse(body).success !== true) {
        return res.send({ error: "ERROR_INCORRECT_CAPTCHA" });
      }
      callback();
    }
  );
};

/* TODO: CSRF */
router.post("/user/logout", async (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  req.session.username_encoded = null;
  return res.sendStatus(200);
});

export default router;
