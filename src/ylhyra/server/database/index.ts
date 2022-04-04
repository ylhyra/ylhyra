import {
  Pool,
  Query,
  QueryCallbackFunction,
  QueryValuesParameter,
} from "ylhyra/server/database/functions/connection";

require("dotenv").config();

if (!process.env.YLHYRA_DATABASE_USER) {
  throw new Error("Missing database configuration!");
}

const pool = Pool({
  database: "ylhyra",
  user: process.env.YLHYRA_DATABASE_USER as string,
  password: process.env.YLHYRA_DATABASE_PASSWORD as string,
});

export default (
  query: string,
  secondParameter: QueryValuesParameter | QueryCallbackFunction,
  thirdParameter?: QueryCallbackFunction | undefined
) => {
  Query(query, secondParameter, thirdParameter, pool);
};
