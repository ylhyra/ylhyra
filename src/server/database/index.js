import { Pool, Query } from "server/database/functions/connection";
require("dotenv").config();

const pool = Pool({
  database: "ylhyra",
  user: process.env.YLHYRA_DATABASE_USER || "example_user",
  password: process.env.YLHYRA_DATABASE_PASSWORD || "example_password",
});

export default (query, secondParameter, thirdParameter) =>
  Query(query, secondParameter, thirdParameter, pool);
