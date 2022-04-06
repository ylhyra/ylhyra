import axios from "ylhyra/app/app/axios";
import { notify } from "ylhyra/app/app/error";
import store from "ylhyra/app/app/store";
import MergeShortWords from "ylhyra/content/translationEditor/audioSynchronization/actions/postprocessing/1_merge_short_words";
import FlattenAeneasData from "ylhyra/content/translationEditor/audioSynchronization/actions/postprocessing/2_flatten";
import MakeLongAudioSyncList from "ylhyra/content/translationEditor/audioSynchronization/actions/postprocessing/3_make_list";
import { AeneasAudioSyncOutput } from "ylhyra/content/translationEditor/audioSynchronization/types";

// const TESTING_WITH_LOCALHOST = true

/**
 * We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.
 * It returns a JSON array of text fragments as can be seen in the file "Synchronize/3_Flatten.js"
 */
export const synchronize = async (filename: string) => {
  const { long_audio } = store.getState().editor;
  try {
    /*
      Todo: Switch to web-socket
    */
    const data: AeneasAudioSyncOutput = (
      await axios.post(`/api/audio/synchronize`, {
        filename,
        ...long_audio[filename],
      })
    ).data;
    if (data.fragments) {
      const list = MakeLongAudioSyncList(
        FlattenAeneasData(MergeShortWords(data.fragments))
      );

      store.dispatch({
        type: "SYNC",
        filename,
        content: {
          original_sync_data: data,
          list,
        },
      });
    }
  } catch (e) {
    notify("Could not synchronize audio");
    console.error(e);
  }
};
