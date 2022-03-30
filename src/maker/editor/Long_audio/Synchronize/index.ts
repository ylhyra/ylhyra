import axios from "app/app/axios";
import error from "app/app/error";
import store from "app/app/store";

import MergeShortWords from "maker/editor/Long_audio/Synchronize/2-Merge-short-words";
import Flatten from "maker/editor/Long_audio/Synchronize/3-Flatten";
import MakeList from "maker/editor/Long_audio/Synchronize/4-Make-list";

// const TESTING_WITH_LOCALHOST = true

/*
  We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.
  It returns a JSON array of text fragments as can be seen in the file "Synchronize/3_Flatten.js"
*/
export const synchronize = async (filename) => {
  const { long_audio } = store.getState().editor;
  try {
    /*
      TODO!!!
      Switch to web-socket
    */
    const data = (
      await axios.post(`/api/audio/synchronize`, {
        filename,
        ...long_audio[filename],
      })
    ).data;
    if (data.fragments) {
      const list = MakeList(Flatten(MergeShortWords(data.fragments)));
      // console.log(list)

      store.dispatch({
        type: "SYNC",
        filename,
        content: {
          // sectionHash,
          original_sync_data: data,
          list,
        },
      });
    }
  } catch (e) {
    error("Could not synchronize audio");
    console.error(e);
  }
};
