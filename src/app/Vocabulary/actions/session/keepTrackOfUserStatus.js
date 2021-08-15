import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card/index.js";

/*

Ef notandi ýtir þrisvar sinnum á easy þá þarf levelið hans að stökkva fram.

*/

let user_level = 0;
let easyInARow = 0;
export const keepTrackOfUserStatus = (rating, isNew) => {
  if (isNew) {
    if (rating === EASY) {
      easyInARow++;
      if (easyInARow === 2) {
        // deck.session.
      }
    } else {
      easyInARow = 0;
    }
  }
};
