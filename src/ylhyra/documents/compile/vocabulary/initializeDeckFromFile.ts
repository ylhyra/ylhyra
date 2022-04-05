import fs from "fs";
import Deck, { deck } from "ylhyra/vocabulary/app/actions/deck";
import { DeckDatabase } from "ylhyra/vocabulary/types";
import { getBaseDir } from "ylhyra/server/paths_backend";

export const initializeDeckFromFile = () => {
  try {
    const database = JSON.parse(
      fs.readFileSync(
        getBaseDir() + `/build/vocabulary/vocabulary_database.json`,
        "utf8"
      )
    ) as DeckDatabase;
    new Deck({ database });
    deck!.alternativeIds = JSON.parse(
      fs.readFileSync(
        getBaseDir() + `/build/vocabulary/alternativeIds.json`,
        "utf8"
      )
    );
  } catch (e) {
    new Deck({});
    deck!.alternativeIds = {};
    console.log("No files to initialize from");
  }
};
