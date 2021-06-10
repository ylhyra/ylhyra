import React from 'react'
import { getUpdatedID } from 'documents/Parse/Compiler/1_Precompile/UpdateID'

// /*
//   [optional] Temporarily mute the audio in development
// */
// const muted = false

export default (audioId, inlineAudioPlayer, editor) => {
  const { audio } = editor
  const hash = audio.sections?.find(section => section.audioElementId === audioId)?.hash
  if (!hash) {
    // console.warn(`No hash for ${audioId}`)
    return null;
  }
  const file = audio.files[hash]?.filename
  const sync = audio.sync[hash]

  if (!file) {
    // console.warn(`No file for ${audioId}`)
    // console.warn({ hash, audio })
    return null;
  }

  let props = {}
  if (inlineAudioPlayer === true || inlineAudioPlayer === 'true') {
    props['data-inline'] = true
  }

  return (
    <div
      className="audioContainer"
      data-id={audioId}
      data-synchronization-list={sync && JSON.stringify(updateIDs(sync.list))}
      data-src={`/media/${file}?v=1`}
      {...props}
    />
    // <div className="audioPlayer">
    //   <audio
    //     data-id={audioId}
    //     data-synchronization-list={sync && JSON.stringify(updateIDs(sync.list))}
    //     // xxautoplay
    //     // xxcontrols
    //     // xxpreload="auto"
    //     // ${muted && process.env.NODE_ENV !== 'production' ? 'muted' : ''}
    //     >
    //     <source onError="window.audioLoadError()" src={`/media/${file}?v=1`} type="audio/mp3"/>
    //   </audio>
    //   <div className="playButton"></div>
    //   <div className="loader"></div>
    //   <div className="error"><span>Audio file missing.</span></div>
    //   <div className="time-wrapper">
    //     <span className="currentTime">-:--</span>
    //     <div className="slider-wrapper">
    //       <div className="slider-background"></div>
    //       <div className="slider-progress-indicator"></div>
    //       <div className="slider-playhead-container">
    //         <div className="slider-playhead"></div>
    //       </div>
    //     </div>
    //     <span className="duration">-:--</span>
    //   </div>
    // </div>

  )
}

const updateIDs = (input) => {
  return input.map(i => ({
    ...i,
    elements: i.elements.map(id => getUpdatedID(id))
  }))
}
