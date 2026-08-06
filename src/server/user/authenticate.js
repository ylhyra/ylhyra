import argon2 from "argon2";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";

/**
 * Look up a user and verify the supplied password.
 *
 * Authentication results are returned to the route instead of writing to the
 * response here. This ensures that a failed login cannot fall through and
 * create a session or cause a second response to be sent.
 */
export const authenticate_user = ({ username, password }) =>
  new Promise((resolve, reject) => {
    query(
      sql`SELECT * FROM users WHERE
      username = ${username} OR
      email = ${username}
    `,
      async (err, results) => {
        if (err) return reject(err);

        if (!results.length) {
          return resolve({ error: "ERROR_USERNAME_DOES_NOT_EXIST" });
        }

        const user = results[0];

        try {
          const password_is_valid = await argon2.verify(
            user.password,
            password
          );

          if (!password_is_valid) {
            return resolve({ error: "ERROR_INCORRECT_PASSWORD" });
          }

          return resolve({ user });
        } catch (error) {
          return reject(error);
        }
      }
    );
  });
