import mysql from "mysql";

export const Pool = ({ database, user, password }) =>
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

export const Query = (query, secondParameter, thirdParameter, pool) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      if (Array.isArray(secondParameter)) {
        thirdParameter(err);
      } else {
        secondParameter(err);
      }
      return;
    }
    let callback;

    if (Array.isArray(secondParameter)) {
      callback = thirdParameter;
      connection.query(query, secondParameter, returns);
    } else {
      callback = secondParameter;
      connection.query(query, returns);
    }

    function returns(err, results) {
      connection.release();
      if (!err) {
        callback(false, results);
      } else {
        console.error(err);
        callback(err);
      }
    }
  });
};
