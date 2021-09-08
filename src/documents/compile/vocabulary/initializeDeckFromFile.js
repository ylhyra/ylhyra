import Deck, { deck } from "app/vocabulary/actions/deck";
import fs from "fs";

export const initializeDeckFromFile = () => {
  const database = JSON.parse(
    fs.readFileSync(
      __basedir + `/build/vocabulary/vocabulary_database.json`,
      "utf8"
    )
  );
  new Deck({ database });
  deck.alternative_ids = JSON.parse(
    fs.readFileSync(
      __basedir + `/build/vocabulary/alternative_ids.json`,
      "utf8"
    )
  );
};
