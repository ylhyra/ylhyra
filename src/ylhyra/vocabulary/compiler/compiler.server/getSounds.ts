import _ from "underscore";
import { GetLowercaseStringForAudioKey } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { VocabularyFileSoundEntry } from "ylhyra/vocabulary/types";

export const getSounds = (
  sentences: string[],
  soundLowercase: VocabularyFileSoundEntry[]
): string[] | null => {
  let output = [];
  sentences.forEach((i) => {
    const b = GetLowercaseStringForAudioKey(i);
    let s = soundLowercase
      .filter((k) => k.recording_of === b)
      .map((j) => j.filename.replace(/\.mp3$/, ""));
    output = output.concat(_.shuffle(s));
  });
  if (output.length > 0) return output;
  return null;
};
