import express, { Router } from "express";
import { UserDataRows } from "flashcards/flashcards/play/actions/userData/userData";
import stable_stringify from "json-stable-stringify";
import { msToS } from "modules/time";
import removeNullKeys from "ylhyra/app/app/functions/removeNullKeys";
import { staticCached } from "ylhyra/server/caching";
import query from "ylhyra/server/database";
import sql from "ylhyra/server/database/functions/SQL-template-literal";
import { getBaseDir } from "ylhyra/server/paths_directories";

const router = Router();

/* Download vocabulary database file */
router.use(
  "/api/vocabulary/",
  staticCached(getBaseDir() + "/build/vocabulary")
);

/* Sync user data */
router.post("/api/vocabulary/sync", async (req, res) => {
  if (!req.session?.user_id) {
    return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
  }
  try {
    const unsyncedFromServer = await getUserData(req);
    const unsyncedFromUser = req.body.unsynced;
    await saveUserData(req, unsyncedFromUser);
    res.send({
      user_id: req.session.user_id,
      rows: unsyncedFromServer || {},
      lastSynced: new Date().getTime(),
    });
  } catch (e) {
    if (typeof e !== "string") {
      console.error(e);
    }
    // @ts-ignore
    res.status(400).send(e.toString() || "");
  }
});

const getUserData = (req: express.Request): Promise<UserDataRows> => {
  return new Promise((resolve) => {
    query(
      sql`
        SELECT
          a.key,
          a.value,
          a.type
        FROM user_data a
        INNER JOIN (
          SELECT max(id) id, \`key\` FROM user_data
            WHERE user_id = ${req.session!.user_id}
            GROUP BY \`key\`
        ) b
        ON a.id = b.id
        WHERE user_id = ${req.session!.user_id}
        AND created_at > FROM_UNIXTIME(${msToS(req.body.lastSynced) || 0})
      `,
      (err, results) => {
        if (err) {
          console.error(err);
          throw new Error();
        } else {
          let out: UserDataRows = {};
          results.forEach(
            ({
              key,
              value,
              type,
            }: {
              key: string;
              value: UserDataRows[string]["value"];
              type: UserDataRows[string]["type"];
            }) => {
              out[key] = {
                value: value.startsWith("{") ? JSON.parse(value) : value,
                type,
              };
            }
          );
          resolve(out);
        }
      }
    );
  });
};

const saveUserData = (req: express.Request, userDataRows: UserDataRows) => {
  return new Promise<void>((resolve) => {
    if (Object.keys(userDataRows).length === 0) {
      return resolve();
    } else if (Object.keys(userDataRows).length > 10000) {
      // TODO
      throw new Error("Too long");
    }

    const queries = Object.keys(userDataRows)
      .map((key) => {
        let value = userDataRows[key].value;
        if (
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean"
        ) {
          value = stable_stringify(removeNullKeys(value));
        }
        return sql`
          INSERT INTO user_data SET
            user_id = ${req.session!.user_id},
            type = ${userDataRows[key].type},
            \`key\` = ${key},
            value = ${value}
          ;
        `;
      })
      .join("");

    query(queries, (err) => {
      if (err) {
        console.error(err);
        throw new Error();
      } else {
        resolve();
      }
    });
  });
};

export default router;

export const delete_test_data = () => {
  return sql`
    DELETE FROM user_data 
      JOIN users ON user_data.user_id = users.id
      WHERE username LIKE 'test_%;
    DELETE FROM users WHERE username LIKE 'test_%';
  `;
};
