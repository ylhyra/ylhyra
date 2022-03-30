"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.Pool = void 0;
const mysql_1 = __importDefault(require("mysql"));
const Pool = ({ database, user, password }) => mysql_1.default.createPool({
    database,
    user,
    password,
    connectionLimit: 10,
    host: "127.0.0.1",
    debug: false,
    multipleStatements: true,
    charset: "utf8mb4_general_ci",
});
exports.Pool = Pool;
const Query = (query, secondParameter, thirdParameter, pool) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            if (Array.isArray(secondParameter)) {
                thirdParameter(err);
            }
            else {
                secondParameter(err);
            }
            return;
        }
        let callback;
        if (Array.isArray(secondParameter)) {
            callback = thirdParameter;
            connection.query(query, secondParameter, returns);
        }
        else {
            callback = secondParameter;
            connection.query(query, returns);
        }
        function returns(err, results) {
            connection.release();
            if (!err) {
                callback(false, results);
            }
            else {
                console.error(err);
                callback(err);
            }
        }
    });
};
exports.Query = Query;
