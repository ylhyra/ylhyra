import express, { Response, Router } from "express";
import { UserData, UserDataRows } from "flashcards/user/userData/userData";

const router = Router();
router.get(
  "/api/vocabulary/sync",
  (req, res: Response<UserData | { error: string }>) => {
    return res.sendStatus(200);
    // try {
    //   const unsyncedFromServer = await serverGetUserData(req);
    //   const unsyncedFromUser = req.body.unsynced;
    //   await saveUserData(req, unsyncedFromUser);
    //   res.send({
    //     user_id: req.session.user_id,
    //     rows: unsyncedFromServer || {},
    //     lastSynced: Date.now(),
    //   });
    // } catch (e) {
    //   if (e instanceof Error) {
    //     res.status(400).send({ error: e.toString() });
    //     console.error(e);
    //   }
    // }
  }
);

/* Sync user data */
router.post(
  "/api/vocabulary/sync",
  (req, res: Response<UserData | { error: string }>) => {
    if (!req.session?.user_id) {
      return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
    }
    return res.sendStatus(200);
    // try {
    //   const unsyncedFromServer = await serverGetUserData(req);
    //   const unsyncedFromUser = req.body.unsynced;
    //   await saveUserData(req, unsyncedFromUser);
    //   res.send({
    //     user_id: req.session.user_id,
    //     rows: unsyncedFromServer || {},
    //     lastSynced: Date.now(),
    //   });
    // } catch (e) {
    //   if (e instanceof Error) {
    //     res.status(400).send({ error: e.toString() });
    //     console.error(e);
    //   }
    // }
  }
);

const serverGetUserData = (
  req: express.Request
) /*: Promise<UserDataRows>*/ => {
  // return new Promise((resolve) => {
  //   query(
  //     sql`
  //       SELECT
  //         a.key,
  //         a.value,
  //         a.type
  //       FROM userData a
  //       INNER JOIN (
  //         SELECT max(id) id, \`key\` FROM userData
  //           WHERE user_id = ${req.session!.user_id}
  //           GROUP BY \`key\`
  //       ) b
  //       ON a.id = b.id
  //       WHERE user_id = ${req.session!.user_id}
  //       AND created_at > FROM_UNIXTIME(${msToS(req.body.lastSynced) || 0})
  //     `,
  //     (err, results) => {
  //       if (err) {
  //         console.error(err);
  //         throw new Error();
  //       } else {
  //         let out: UserDataRows = {};
  //         results.forEach(
  //           ({
  //             key,
  //             value,
  //             type,
  //           }: {
  //             key: string;
  //             value: UserDataRows[string]["value"];
  //             type: UserDataRows[string]["type"];
  //           }) => {
  //             out[key] = {
  //               value: value.startsWith("{") ? JSON.parse(value) : value,
  //               type,
  //             };
  //           }
  //         );
  //         resolve(out);
  //       }
  //     }
  //   );
  // });
};

const saveUserData = (req: express.Request, userDataRows: UserDataRows) => {
  // return new Promise<void>((resolve) => {
  //   if (Object.keys(userDataRows).length === 0) {
  //     return resolve();
  //   } else if (Object.keys(userDataRows).length > 10000) {
  //     // TODO
  //     throw new Error("Too long");
  //   }
  //
  //   const queries = Object.keys(userDataRows)
  //     .map((key) => {
  //       let value = userDataRows[key].value;
  //       if (
  //         typeof value !== "string" &&
  //         typeof value !== "number" &&
  //         typeof value !== "boolean"
  //       ) {
  //         value = stable_stringify(removeNullKeys(value));
  //       }
  //       return sql`
  //         INSERT INTO userData SET
  //           user_id = ${req.session!.user_id},
  //           type = ${userDataRows[key].type},
  //           \`key\` = ${key},
  //           value = ${value}
  //         ;
  //       `;
  //     })
  //     .join("");
  //
  //   query(queries, (err) => {
  //     if (err) {
  //       console.error(err);
  //       throw new Error();
  //     } else {
  //       resolve();
  //     }
  //   });
  // });
};

export default router;
