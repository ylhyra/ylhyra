"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const functions_1 = require("documents/compile/functions/functions");
const request_1 = __importDefault(require("request"));
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const argon_hash = argon2_1.default.hash;
const argon_verify = argon2_1.default.verify;
const router = require("express").Router();
const speedLimit = require("express-slow-down")({
    windowMs: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: process.env.TESTING ? 0 : 700,
});
const rateLimit = require("express-rate-limit")({
    windowMs: 1 * 60 * 1000,
    max: process.env.TESTING ? Infinity : 5,
});
router.post("/user", speedLimit, rateLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let username = (_a = req.body.username) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s+/g, " ");
    const email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.trim();
    const { password, captcha_token, type } = req.body;
    if (!username) {
        return res.send({ error: "ERROR_USERNAME_REQUIRED" });
    }
    if (!password) {
        return res.send({ error: "ERROR_PASSWORD_REQUIRED" });
    }
    captcha(captcha_token, res, () => __awaiter(void 0, void 0, void 0, function* () {
        let user_id, user, did_user_exist;
        if (type === "login") {
            user = yield get_user({ username, password, res });
            username = user.username;
            user_id = user.id;
            did_user_exist = true;
        }
        else if (type === "signup") {
            /* Check if username is valid */
            if (/@/.test(username)) {
                return res.send({ error: "ERROR_INVALID_USERNAME" });
            }
            /* Check if username or email already exists */
            const error = yield check_if_user_exists({ email, username });
            if (error)
                return res.send({ error });
            user_id = yield create_user({ email, username, password, res });
        }
        req.session.user_id = user_id;
        req.session.username_encoded = (0, functions_1.EncodeDataInHTML)(username, true);
        return res.send({ user_id, username, did_user_exist });
    }));
}));
const get_user = ({ username, password, res }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, database_1.default)((0, SQL_template_literal_1.default) `SELECT * FROM users WHERE
      username = ${username} OR
      email = ${username}
    `, (err, results) => {
            if (results.length > 0) {
                const row = results[0];
                if (!argon_verify(row.password, password)) {
                    return res.send({ error: "ERROR_INCORRECT_PASSWORD" });
                }
                resolve(row);
            }
            else {
                return res.send({ error: "ERROR_USERNAME_DOES_NOT_EXIST" });
            }
        });
    });
});
/*
  Returns "ERROR_USERNAME_EXISTS" or "ERROR_EMAIL_ALREADY_IN_USE"
*/
const check_if_user_exists = ({ email, username }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        let q;
        if (email) {
            q = (0, SQL_template_literal_1.default) `SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
        }
        else {
            q = (0, SQL_template_literal_1.default) `SELECT * FROM users WHERE username = ${username}`;
        }
        (0, database_1.default)(q, (err, results) => {
            if (results.length > 0) {
                if (email && results[0].email.toLowerCase() === email.toLowerCase()) {
                    return resolve("ERROR_EMAIL_ALREADY_IN_USE");
                }
                else {
                    return resolve("ERROR_USERNAME_EXISTS");
                }
            }
            return resolve(null);
        });
    });
});
const create_user = ({ username, email, password, res }) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const hash = yield argon_hash(password);
        (0, database_1.default)((0, SQL_template_literal_1.default) `INSERT INTO users SET
      username = ${username},
      email = ${email || null},
      password = ${hash}
      `, (err, results2) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(500).send({ error: "ERROR_USER_ALREADY_EXIST" });
                }
                return res.sendStatus(500);
            }
            else {
                resolve(results2.insertId);
            }
        });
    }));
};
const captcha = (captcha_token, res, callback) => {
    if (!process.env.REACT_APP_HCAPTCHA_SITEKEY) {
        return callback();
    }
    if (!captcha_token) {
        return res.send({ error: "ERROR_INCORRECT_CAPTCHA" });
    }
    request_1.default.post({
        url: "https://hcaptcha.com/siteverify",
        form: {
            response: captcha_token,
            secret: process.env.HCAPTCHA_SECRET,
        },
    }, (error, response, body) => {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }
        else if (JSON.parse(body).success !== true) {
            return res.send({ error: "ERROR_INCORRECT_CAPTCHA" });
        }
        callback();
    });
};
/* TODO: CSRF */
router.post("/user/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.user_id = null;
    req.session.username = null;
    req.session.username_encoded = null;
    return res.sendStatus(200);
}));
exports.default = router;
