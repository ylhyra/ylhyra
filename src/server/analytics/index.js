"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = require("app/app/functions/time");
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const shortid_1 = __importDefault(require("shortid"));
const underscore_1 = __importDefault(require("underscore"));
const router = require("express").Router();
const { Crawler } = require("es6-crawler-detect");
const rateLimit = require("express-rate-limit")({
    windowMs: 1 * time_1.minute,
    max: 3,
});
// const MAX_TO_SAVE = 300;
router.post("/a", rateLimit, (req, res) => {
    var _a, _b, _c;
    /* Ignore robots */
    if (new Crawler(req).isCrawler()) {
        return res.sendStatus(200);
    }
    if (!req.session.session_id) {
        req.session.session_id = shortid_1.default.generate();
    }
    // ip = ${req.clientIp},
    if (!req.body.queue ||
        !Array.isArray(req.body.queue) ||
        req.body.queue.length > 40) {
        return res.sendStatus(400);
    }
    let languages = [];
    (_a = req.headers["accept-language"]) === null || _a === void 0 ? void 0 : _a.replace(/\b([a-z]{2,3})(-[a-z]{2,3})?\b/g, (x, lang) => {
        languages.push(lang);
    });
    /*
      Page views
    */
    (0, database_1.default)((_c = (_b = req.body.queue
        .filter(Boolean)).map) === null || _c === void 0 ? void 0 : _c.call(_b, (entry) => (0, SQL_template_literal_1.default) `INSERT INTO analytics SET
            user_id = ${req.session.user_id || null},
            session_id = ${req.session.session_id},
            country = ${req.get("CF-IPCountry") || null},
            type = ${entry === null || entry === void 0 ? void 0 : entry.type},
            page_name = ${(entry === null || entry === void 0 ? void 0 : entry.url) ? decodeURI(entry.url) : null},
            seconds_spent = ${(entry === null || entry === void 0 ? void 0 : entry.seconds) || null},
            user_languages = ${underscore_1.default.uniq(languages).slice(0, 4).join(",")},
            referrer = ${(entry === null || entry === void 0 ? void 0 : entry.referrer) || null},
            timestamp = FROM_UNIXTIME(${(0, time_1.roundMsToMinute)(entry.timestamp ? entry.timestamp / 1000 : (0, time_1.getTime)())})            
            ;
          `).join(""), (err) => {
        if (err) {
            console.error(err);
        }
        else {
            // console.log(results);
        }
    });
    res.sendStatus(200);
});
// /*
//   List most popular pages by unique visitors
// */
// router.get("/analytics/overview", (req, res) => {
//   query(
//     sql`
//     SELECT
//       page_name,
//       SUM(total_views) as total_views,
//       COUNT(user_session) AS unique_views
//     FROM interactions AS table1
//     JOIN  (
//       SELECT
//         id,
//         COUNT(user_session) AS total_views
//       FROM interactions
//       WHERE type = "view"
//       GROUP BY user_session
//     ) AS table2
//     ON table1.id = table2.id
//     WHERE type = "view"
//     GROUP BY page_name
//     ORDER BY unique_views DESC
//     LIMIT 20;
//   `,
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.sendStatus(500);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });
exports.default = router;
