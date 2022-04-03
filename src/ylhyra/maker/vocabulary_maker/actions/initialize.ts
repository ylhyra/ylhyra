import axios from "ylhyra/app/app/axios";
import store from "ylhyra/app/app/store";
import {
  Database,
  findMissingDependencies,
  refreshRows,
} from "ylhyra/maker/vocabulary_maker/actions/actions";
import { setupSound } from "ylhyra/maker/vocabulary_maker/actions/sound";
import { getDeckName } from "ylhyra/maker/vocabulary_maker/compile/functions";
import { parseVocabularyFile } from "ylhyra/maker/vocabulary_maker/compile/parse_vocabulary_file";

export const load = async () => {
  // window.skip_hash = true;
  console.log(getDeckName());
  let vocabulary = (
    await axios.post(`/api/vocabulary_maker/get`, {
      deckName: getDeckName(),
    })
  ).data;
  Database.sound = vocabulary?.sound || [];
  Database.rows = vocabulary?.rows || [];

  Database.rows.forEach((row) => {
    Database.maxID = Math.max(Database.maxID, row.row_id);
  });
  Database.rows = Database.rows.map((row) => {
    // if (row.importance) {
    //   row.importance += 3;
    // }
    return row;
  });

  Object.assign(Database, parseVocabularyFile(vocabulary));

  if (store.getState().route.pathname === "/maker/record") {
    setTimeout(() => {
      setupSound();
    }, 1000);
  }

  findMissingDependencies();
  refreshRows();
};