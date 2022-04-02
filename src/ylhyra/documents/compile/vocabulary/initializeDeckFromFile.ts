import fs from "fs";
import Deck, { deck } from "ylhyra/app/vocabulary/actions/deck";
import { getBaseDir } from "ylhyra/server/paths_backend";

export const initializeDeckFromFile = () => {
  try {
    const database = JSON.parse(
      fs.readFileSync(
        getBaseDir() + `/build/vocabulary/vocabulary_database.json`,
        "utf8"
      )
    );
    new Deck({ database });
    deck.alternative_ids = JSON.parse(
      fs.readFileSync(
        getBaseDir() + `/build/vocabulary/alternative_ids.json`,
        "utf8"
      )
    );
  } catch (e) {
    new Deck({});
    deck.alternative_ids = {};
    console.log("No files to initialize from");
  }
};
