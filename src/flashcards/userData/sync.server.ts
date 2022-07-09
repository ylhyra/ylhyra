import type { Request, Response } from "express";
import express, { Router } from "express";
import { prisma } from "flashcards/database/database.server";
import { SyncedUserDataStore } from "flashcards/userData/userDataStore";
import stable_stringify from "json-stable-stringify";
import removeNullKeys from "modules/removeNullKeys";

const router = Router();

/* Sync user data */
router.post(
  "/api/vocabulary/sync",
  async (
    req: Request<{}, {}, SyncedUserDataStore>,
    res: Response<SyncedUserDataStore | { error: string }>,
  ) => {
    // TODO: Verify same as user who sent
    if (!req.session?.userId) {
      return res.status(401).send({ error: "ERROR_NOT_LOGGED_IN" });
    }
    try {
      // We must first get the unsaved before we save anything else
      const unsyncedFromServer = await getUserDataFromDatabase(req);
      await saveUserDataInDatabase(req);
      res.send({
        userId: req.session.userId,
        values: unsyncedFromServer || {},
        lastSynced: Date.now(),
      });
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).send({ error: e.toString() });
        console.error(e);
      }
    }
  },
);

const getUserDataFromDatabase = async (
  req: Request,
): Promise<SyncedUserDataStore["values"]> => {
  const results = await prisma.$queryRaw`
    SELECT
      a.key,
      a.value,
      a.type
    FROM userData a
    INNER JOIN (
      SELECT max(id) id, \`key\` FROM userData
        WHERE userId = ${req.session!.userId}
        GROUP BY \`key\`
    ) b
    ON a.id = b.id
    WHERE userId = ${req.session!.userId}
    AND updatedAt > (${req.body.lastSynced || 0})
  `;

  // console.log({ lastSynced: req.body.lastSynced, results });
  let out: SyncedUserDataStore["values"] = {};
  (results as any).forEach(
    ({
      key,
      value,
      type,
      updatedAt,
    }: {
      key: string;
      value: string; //SyncedUserDataStore["values"][string]["value"];
      type: SyncedUserDataStore["values"][string]["type"];
      updatedAt: number;
    }) => {
      out[key] = {
        key,
        value: JSON.parse(value),
        type,
        // updatedAt,
      };
    },
  );
  return out;
};

const saveUserDataInDatabase = async (req: express.Request) => {
  const values: SyncedUserDataStore["values"] = req.body.unsynced;
  if (Object.keys(values).length === 0) {
    return;
  } else if (Object.keys(values).length > 30_000) {
    // TODO
    throw new Error("Too long");
  }

  const queries = Object.keys(values).map((key) => {
    if (
      typeof values[key].type !== "string" ||
      typeof values[key].value !== "object"
    ) {
      throw new Error("Malformed data sent to server");
    }

    // const updatedAt = values[key].updatedAt
    //   ? Math.min(values[key].updatedAt!, Date.now())
    //   : Date.now();

    // TODO: Update instead?
    return prisma.userData.create({
      data: {
        userId: req.session!.userId as string,
        key,
        value: stable_stringify(removeNullKeys(values[key].value)),
        type: values[key].type,
        // updatedAt: new Date(updatedAt),
      },
    });
  });

  await prisma.$transaction(queries);
};

// eslint-disable-next-line import/no-default-export
export default router;
