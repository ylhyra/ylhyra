"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("server/database/functions/connection");
require("dotenv").config();
if (!process.env.YLHYRA_DATABASE_USER) {
    throw new Error("Missing database configuration!");
}
const pool = (0, connection_1.Pool)({
    database: "ylhyra",
    user: process.env.YLHYRA_DATABASE_USER,
    password: process.env.YLHYRA_DATABASE_PASSWORD,
});
exports.default = (query, secondParameter, thirdParameter) => {
    (0, connection_1.Query)(query, secondParameter, thirdParameter, pool);
};
