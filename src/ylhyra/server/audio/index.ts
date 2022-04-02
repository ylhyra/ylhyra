import Sound from "datasets/sounds";
import { Router } from "express";

const router = Router();

/*
  Finds PRONUNCIATION and SOUND
*/
export default async ({ missingPronunciation, missingSound }, callback) => {
  let pronunciation = {};
  // await Promise.all(missingPronunciation.map(text => (
  //   new Promise(async resolve => {
  //     pronunciation[text] = await Pronunciation(text)
  //     resolve()
  //   })
  // )))

  let sound = {};
  await Promise.all(
    missingSound.map(
      (text) =>
        new Promise(async (resolve) => {
          sound[text] = await Sound(text);
          resolve();
        })
    )
  );

  callback({ type: "SOUND", pronunciation, sound });
};
