import { Scalar } from "modules/typescript/scalar";
import mysql, { MysqlError, queryCallback } from "mysql";

export const Pool = ({
  database,
  user,
  password,
}: {
  database: string;
  user: string;
  password: string;
}) =>
  mysql.createPool({
    database,
    user,
    password,
    connectionLimit: 10,
    host: "127.0.0.1",
    debug: false,
    multipleStatements: true,
    charset: "utf8mb4_general_ci",
  });

export type QueryValuesParameter = any[];
export type QueryCallbackFunction = (
  err: MysqlError | Boolean,
  results: any[] // QueryResultsParameter
) => void;
export type QueryResultsParameter = Array<Scalar> | Array<Array<Scalar>>;
export const Query = (
  query: string,
  secondParameter: QueryValuesParameter | QueryCallbackFunction,
  thirdParameter: QueryCallbackFunction | undefined,
  pool: ReturnType<typeof Pool>
) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      if (Array.isArray(secondParameter)) {
        (thirdParameter as QueryCallbackFunction)(err, []);
      } else {
        (secondParameter as QueryCallbackFunction)(err, []);
      }
      return;
    }
    let callback: QueryCallbackFunction;

    const callbackInterceptor: queryCallback = (err, results) => {
      connection.release();
      if (!err) {
        callback(false, results);
      } else {
        console.error(err);
        callback(err, []);
      }
    };

    if (Array.isArray(secondParameter)) {
      callback = thirdParameter as QueryCallbackFunction;
      connection.query(query, secondParameter, callbackInterceptor);
    } else {
      callback = secondParameter as QueryCallbackFunction;
      connection.query(query, callbackInterceptor);
    }
  });
};
