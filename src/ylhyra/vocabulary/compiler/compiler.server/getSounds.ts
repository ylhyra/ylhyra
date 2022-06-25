import _ from "underscore";
import { getLowercaseStringForAudioKey } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { VocabularyFileSoundEntry } from "ylhyra/vocabulary/types";

export function getSounds(
  sentences: string[] | undefined,
  soundLowercase: VocabularyFileSoundEntry[]
): string[] | null {
  if (!sentences) return null;
  let output: string[] = [];
  sentences.forEach((i) => {
    const b = getLowercaseStringForAudioKey(i);
    let s = soundLowercase
      .filter((k) => k.recording_of === b)
      .map((j) => j.filename.replace(/\.mp3$/, ""));
    output = output.concat(_.shuffle(s));
  });
  if (output.length === 0) return null;
  return output;
}
