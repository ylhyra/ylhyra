import React from 'react'
import axios from 'axios'
import store from 'App/store'
import ReactDOMServer from 'react-dom/server'
import error from 'App/Error'

import AudioXML from './1-Prepare-XML-for-audio-sync'
import MergeShortWords from './2-Merge-short-words'
import Flatten from './3-Flatten'
import MakeList from './4-Make-list'

/*
  We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.
  It returns a JSON array of text fragments as can be seen in the file "Synchronize/3_Flatten.js"
*/
export const synchronize = async (sectionHash) => {
  const { editor } = store.getState()
  try {
    if(!editor.audio.files[sectionHash]) {
      console.warn('No file with that section hash')
      return
    }
    // console.log(ReactDOMServer.renderToStaticMarkup(AudioXML(sectionHash) || null))
    // return

    /*
      TODO!!!
      Switch to web-socket
    */
    const data = (await axios.post(`/api/audio/synchronize`, {
      lang: 'isl',
      audio_file: editor.audio.files[sectionHash].filename,
      xml: AudioXML(sectionHash)
    })).data

    if (data.fragments) {
      const list = MakeList(Flatten(MergeShortWords(data.fragments)))
      console.log(list)
      store.dispatch({
        type: 'SYNC',
        content: {
          sectionHash,
          original_sync_data: data,
          list,
        }
      })
    }
  } catch (e) {
    error('Could not synchronize audio')
    console.error(e)
  }
}
