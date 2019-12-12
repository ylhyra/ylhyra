import React from 'react'
import axios from 'axios'
import store from 'App/store'
import ReactDOMServer from 'react-dom/server'
import error from 'App/Error'

import MergeShortWords from './2-Merge-short-words'
import Flatten from './3-Flatten'
import MakeList from './4-Make-list'

const TESTING_WITH_LOCALHOST = false
const url = TESTING_WITH_LOCALHOST ? 'https://localhost:8000' : ''

/*
  We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.
  It returns a JSON array of text fragments as can be seen in the file "Synchronize/3_Flatten.js"
*/
export const synchronize = async () => {
  const { long_audio } = store.getState().editor
  try {
    /*
      TODO!!!
      Switch to web-socket
    */
    const data = (await axios.post(`${url}/api/audio/synchronize`, long_audio)).data
    console.log(data)
    // if (data.fragments) {
    //   const list = MakeList(Flatten(MergeShortWords(data.fragments)))
    //   console.log(list)
    //   store.dispatch({
    //     type: 'SYNC',
    //     content: {
    //       sectionHash,
    //       original_sync_data: data,
    //       list,
    //     }
    //   })
    // }
  } catch (e) {
    error('Could not synchronize audio')
    console.error(e)
  }
}
