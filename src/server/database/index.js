import { Pool, Query } from "server/database/functions/connection";
require("dotenv").config();

if (!process.env.YLHYRA_DATABASE_USER) {
  throw new Error("Missing database configuration!");
}

const pool = Pool({
  database: "ylhyra",
  user: process.env.YLHYRA_DATABASE_USER,
  password: process.env.YLHYRA_DATABASE_PASSWORD,
});

export default (query, secondParameter, thirdParameter) => {
  // if(Array.isArray(query))
  Query(query, secondParameter, thirdParameter, pool);
};
