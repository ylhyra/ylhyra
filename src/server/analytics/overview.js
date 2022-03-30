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
const isDev_1 = require("app/app/functions/isDev");
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const time_1 = require("app/app/functions/time");
const database_1 = __importDefault(require("server/database"));
const router = require("express").Router();
router.get("/analytics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isDev_1.isDev && req.session.username !== "egill") {
        return res.sendStatus(200);
    }
    let html = "";
    html += yield CountPayments({ daysBack: 1 });
    html += yield CountPayments({ daysBack: 7 });
    html += yield CountPayments({ daysBack: 30 });
    html += "<hr/>";
    html += yield CountUsers({ daysBack: 1 });
    html += yield CountUsers({ daysBack: 7 });
    html += yield CountUsers({ daysBack: 30 });
    html += yield CountUsers({});
    html += "<hr/>";
    html += yield CountUniqueVisitors({ daysBack: 1 });
    html += yield CountUniqueVisitors({ daysBack: 7 });
    html += yield CountUniqueVisitors({ daysBack: 30 });
    res.send(html);
}));
const CountPayments = ({ daysBack }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, database_1.default)((0, no_undefined_in_template_literal_1.default) `
      SELECT SUM(price) as price FROM payments
      WHERE created_at > ${getDaysBack(daysBack)}
    `, (err, results) => {
            var _a;
            if (err) {
                console.error(err);
            }
            else {
                // resolve(tableify(results));
                resolve((0, no_undefined_in_template_literal_1.default) `$${((_a = results[0]) === null || _a === void 0 ? void 0 : _a.price) || 0} received ${daysBack ? `in the last ${daysBack} days` : `overall`}<br/>`);
            }
        });
    });
});
const CountUniqueVisitors = ({ daysBack }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, database_1.default)(`
        SELECT COUNT(*) as count FROM (
          ${distinct_ids(daysBack)}
        ) distinct_ids
    `, (err, results) => {
            var _a;
            if (err) {
                console.error(err);
            }
            else {
                // resolve(tableify(results));
                resolve((0, no_undefined_in_template_literal_1.default) `${(_a = results[0]) === null || _a === void 0 ? void 0 : _a.count} unique visitors  ${daysBack ? `in the last ${daysBack} days` : `overall`}<br/>`);
            }
        });
    });
});
const CountUsers = ({ daysBack }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        (0, database_1.default)((0, no_undefined_in_template_literal_1.default) `
      SELECT COUNT(id) as count FROM users
      ${daysBack &&
            `WHERE created_at > FROM_UNIXTIME(${(new Date().getTime() - daysBack * time_1.days) / 1000})`}
    `, (err, results) => {
            var _a;
            if (err) {
                console.error(err);
            }
            else {
                // resolve(tableify(results));
                resolve((0, no_undefined_in_template_literal_1.default) `${(_a = results[0]) === null || _a === void 0 ? void 0 : _a.count} users created  ${daysBack ? `in the last ${daysBack} days` : `overall`}<br/>`);
            }
        });
    });
});
/*
  List most popular pages by unique visitors
*/
router.get("/a", () => {
    // query(sql`
    //   SELECT
    //     page_name,
    //     SUM(total_views) as total_views,
    //     COUNT(user_session) AS unique_views
    //   FROM interactions AS table1
    //   JOIN  (
    //     SELECT
    //       id,
    //       COUNT(user_session) AS total_views
    //     FROM interactions
    //     WHERE type = "view"
    //     GROUP BY user_session
    //   ) AS table2
    //   ON table1.id = table2.id
    //   WHERE type = "view"
    //   GROUP BY page_name
    //   ORDER BY unique_views DESC
    //   LIMIT 20;
    // `, (err, results) => {
    //   if (err) {
    //     console.error(err)
    //     res.sendStatus(500)
    //   } else {
    //     res.send(results)
    //   }
    // })
});
exports.default = router;
const getDaysBack = (i) => {
    if (i)
        return `
  FROM_UNIXTIME(${(new Date().getTime() - i * time_1.days) / 1000})`;
    else
        return `FROM_UNIXTIME(0)`;
};
const distinct_ids = (daysBack) => `
  SELECT
    DISTINCT(IFNULL(unique_sessions.user_id, unique_sessions.session_id)) distinct_id
    FROM (
      -- Get list of uniqe session_ids and their last associated user_id
      SELECT a3.user_id, a2.session_id FROM
        (
          SELECT DISTINCT(session_id) as session_id FROM analytics
          WHERE timestamp > ${getDaysBack(daysBack)}
        ) a2
        -- Get last associated user_id
        LEFT JOIN analytics a3
          ON a3.id = (
            SELECT id
            FROM analytics a4
            WHERE a4.session_id = a2.session_id
              AND a3.user_id IS NOT NULL
              ORDER BY id
            LIMIT 1
          )
    ) unique_sessions
`;
