import { Pool, Query } from "server/database/functions/connection";

require("dotenv").config();

let pool;

export const hasDatabaseConfiguration = () =>
  Boolean(
    process.env.YLHYRA_DATABASE_USER &&
      process.env.YLHYRA_DATABASE_PASSWORD
  );

export const assertDatabaseConfiguration = () => {
  if (!hasDatabaseConfiguration()) {
    throw new Error("Missing database configuration!");
  }
};

const getPool = () => {
  assertDatabaseConfiguration();
  if (!pool) {
    pool = Pool({
      database: "ylhyra",
      user: process.env.YLHYRA_DATABASE_USER,
      password: process.env.YLHYRA_DATABASE_PASSWORD,
    });
  }
  return pool;
};

export default (query, secondParameter, thirdParameter) => {
  Query(query, secondParameter, thirdParameter, getPool());
};
