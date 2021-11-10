import { getDeckName } from "maker/vocabulary_maker/compile/functions";
import axios from "app/app/axios";
import { parse_vocabulary_file } from "maker/vocabulary_maker/compile/parse_vocabulary_file";
import { setupSound } from "maker/vocabulary_maker/actions/sound";
import {
  Database,
  findMissingDependencies,
  refreshRows,
} from "maker/vocabulary_maker/actions/actions";
import store from "app/app/store";
import { getPlaintextFromVocabularyEntry } from "maker/vocabulary_maker/compile/format";

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
    // if (row.level) {
    //   row.level = Math.floor(row.level);
    // }
    return row;
  });

  Object.assign(Database, parse_vocabulary_file(vocabulary));

  if (store.getState().route.pathname === "/maker/record") {
    setTimeout(() => {
      setupSound();
    }, 1000);
  }

  findMissingDependencies();
  refreshRows();
};
