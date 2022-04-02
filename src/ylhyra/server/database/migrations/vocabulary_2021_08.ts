import stable_stringify from "json-stable-stringify";
import forEachAsync from "modules/forEachAsync";
import removeNullKeys from "ylhyra/app/app/functions/removeNullKeys";
import sql from "ylhyra/server/database/functions/SQL-template-literal";
import query from "ylhyra/server/database/index";

/*

Migration from `vocabulary_schedule_BACKUP` to `user_data`

npm run build_server && node build/server/ylhyra_server.js --migration_vocabulary_2021_08

*/

query(
  sql`
  SELECT * ,
    UNIX_TIMESTAMP(due) * 1000 as due,
    UNIX_TIMESTAMP(last_seen) * 1000 as last_seen
  FROM vocabulary_schedule_BACKUP
  ORDER BY id ASC
  `,
  async (err, results) => {
    if (err) {
      console.error(err);
    } else {
      await forEachAsync(
        results,
        async ({ id, user_id, cardId, created_at, ...row }) => {
          return new Promise((resolve) => {
            query(
              sql`
            INSERT INTO user_data SET
              user_id = ${user_id},
              type = "schedule",
              \`key\` = ${cardId},
              value = ${stable_stringify(removeNullKeys(row))},
              created_at = ${created_at || null}
            ;`,
              async () => {
                resolve();
              }
            );
          });
        }
      );
      console.log("Done");
      process.exit();
    }
  }
);
