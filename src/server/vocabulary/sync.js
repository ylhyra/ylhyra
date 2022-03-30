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
exports.delete_test_data = void 0;
const removeNullKeys_1 = __importDefault(require("app/app/functions/removeNullKeys"));
const time_1 = require("app/app/functions/time");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const caching_1 = require("server/caching");
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const router = require("express").Router();
/* Download vocabulary database file */
router.use("/vocabulary/", (0, caching_1.staticCached)(__basedir + "/build/vocabulary"));
/* Sync user data */
router.post("/vocabulary/sync", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user_id) {
        return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
    }
    try {
        const unsyncedFromServer = yield getUserData(req);
        const unsyncedFromUser = req.body.unsynced;
        // // Filter based on time?
        // .filter(item=>{
        // })
        yield saveUserData(req, unsyncedFromUser);
        res.send({
            user_id: req.session.user_id,
            rows: unsyncedFromServer || {},
            lastSynced: new Date().getTime(),
        });
    }
    catch (e) {
        if (typeof e !== "string") {
            console.error(e);
        }
        res.status(400).send(e.toString() || "");
    }
}));
const getUserData = (req) => {
    return new Promise((resolve) => {
        (0, database_1.default)((0, SQL_template_literal_1.default) `
        SELECT
          a.key,
          a.value,
          a.type
        FROM user_data a
        INNER JOIN (
          SELECT max(id) id, \`key\` FROM user_data
            WHERE user_id = ${req.session.user_id}
            GROUP BY \`key\`
        ) b
        ON a.id = b.id
        WHERE user_id = ${req.session.user_id}
        AND created_at > FROM_UNIXTIME(${(0, time_1.msToS)(req.body.lastSynced) || 0})
      `, (err, results) => {
            if (err) {
                console.error(err);
                throw new Error();
            }
            else {
                let out = {};
                results.forEach(({ key, value, type }) => {
                    out[key] = {
                        value: value.startsWith("{") ? JSON.parse(value) : value,
                        type,
                    };
                });
                resolve(out);
            }
        });
    });
};
const saveUserData = (req, object) => {
    return new Promise((resolve) => {
        if (Object.keys(object).length === 0) {
            return resolve();
        }
        else if (Object.keys(object).length > 10000) {
            // TODO
            throw new Error("Too long");
        }
        const queries = Object.keys(object)
            .map((key) => {
            let value = object[key].value;
            if (typeof value !== "string" &&
                typeof value !== "number" &&
                typeof value !== "boolean") {
                value = (0, json_stable_stringify_1.default)((0, removeNullKeys_1.default)(value));
            }
            return (0, SQL_template_literal_1.default) `
          INSERT INTO user_data SET
            user_id = ${req.session.user_id},
            type = ${object[key].type},
            \`key\` = ${key},
            value = ${value}
          ;
        `;
        })
            .join("");
        (0, database_1.default)(queries, (err) => {
            if (err) {
                console.error(err);
                throw new Error();
            }
            else {
                resolve();
            }
        });
    });
};
exports.default = router;
const delete_test_data = () => {
    return (0, SQL_template_literal_1.default) `
    DELETE FROM user_data 
      JOIN users ON user_data.user_id = users.id
      WHERE username LIKE 'test_%;
    DELETE FROM users WHERE username LIKE 'test_%';
  `;
};
exports.delete_test_data = delete_test_data;
