import mysql, { queryCallback } from "mysql";

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
// export type QueryResultsParameter = Array<Scalar> | Array<Array<Scalar>>;
export const Query = (
  query: string,
  secondParameter: QueryValuesParameter | queryCallback,
  thirdParameter: queryCallback | undefined,
  pool: ReturnType<typeof Pool>
) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      if (Array.isArray(secondParameter)) {
        (thirdParameter as queryCallback)(err, []);
      } else {
        (secondParameter as queryCallback)(err, []);
      }
      return;
    }
    let callback: queryCallback;

    const callbackInterceptor: queryCallback = (err, results) => {
      connection.release();
      if (!err) {
        callback(null, results);
      } else {
        console.error(err);
        callback(err, []);
      }
    };

    if (Array.isArray(secondParameter)) {
      callback = thirdParameter as queryCallback;
      connection.query(query, secondParameter, callbackInterceptor);
    } else {
      callback = secondParameter as queryCallback;
      connection.query(query, callbackInterceptor);
    }
  });
};
