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
// import { hash as argon_hash, verify as argon_verify } from 'argon2'
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const router = require("express").Router();
const speedLimit = require("express-slow-down")({
    windowMs: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: 300,
});
/* Payments */
router.post("/pwyw", speedLimit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.session.user_id;
    // if (!user_id) return res.status(400).send("Not logged in");
    const { price, transaction_id } = req.body;
    (0, database_1.default)((0, SQL_template_literal_1.default) `INSERT INTO payments SET
      user_id = ${user_id || "session_" + req.session.session_id},
      price = ${price},
      transaction_id = ${transaction_id},
      type = "pwyw"
      `, () => {
        res.sendStatus(200);
    });
}));
exports.default = router;
