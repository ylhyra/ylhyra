import { AeneasAudioSyncOutput } from "ylhyra/documents/translationEditor/audioSynchronization/types";

const minimumTime = 0.3;

/**
 * Words under 0.3 seconds are
 * merged into their sibling
 */
export default function MergeShortWords(
  input: AeneasAudioSyncOutput["fragments"]
): AeneasAudioSyncOutput["fragments"] {
  const Merge = (
    input_words: AeneasAudioSyncOutput["fragments"][number]["children"][number]["children"]
  ) => {
    let words = JSON.parse(JSON.stringify(input_words)); // TEMP
    for (let index = 0; index < words.length; index++) {
      let begin = words[index].begin;
      let end = words[index].end;
      let timespan = end - begin;
      let mergeCount = 0;

      for (let m = 0; timespan < minimumTime && index + m < words.length; m++) {
        mergeCount = m;
        end = words[index + mergeCount].end;
        timespan = end - begin;
      }

      for (let i = index; i <= index + mergeCount; i++) {
        words[i] = {
          ...words[i],
          begin,
          end,
        };
      }
    }
    return words;
  };

  try {
    return input.map((paragraph) => ({
      ...paragraph,
      children: paragraph.children.map((sentence) => ({
        ...sentence,
        children: Merge(sentence.children),
      })),
    }));
  } catch (e) {
    console.error(e);
    return input;
  }
}
