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
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const router = require("express").Router();
router.get("/vocabulary/session_log_migration", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.session_id && !req.session.user_id) {
        return res.sendStatus(200);
    }
    (0, database_1.default)((0, SQL_template_literal_1.default) `
        SELECT 
        UNIX_TIMESTAMP(timestamp) * 1000 as timestamp, 
        seconds_spent
        FROM analytics a
        WHERE 
        (user_id = ${req.session.user_id}
          OR session_id = ${req.session.session_id})
        AND timestamp < "2021-11-28 21:36:32"
        AND type = "vocabulary"
      `, // TODO
    (err, results) => {
        if (err) {
            console.error(err);
            throw new Error();
        }
        else {
            res.send(results);
        }
    });
}));
exports.default = router;
