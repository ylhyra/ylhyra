import store from 'App/store'
import { getText } from 'project/text-plugin/Parse/ExtractText/ExtractText'
import { getTextFromTokenized } from 'project/text-plugin/Parse/WrapInTags/1-InsertSplit.js'
import hash from 'project/text-plugin/App/functions/hash'




// data - audio - file = "Ánamaðkar.mp3"

/*
  Finds the IDs of audio sections and
  matches them up with the tokenized paragraph IDs
*/
export const findAudioSections = () => {
  const { parsed, tokenized } = store.getState().editor
  const tokenizedParagraphs = tokenized.map(({ hashOfIds, sentences }) => ({
    hashOfIds,
    text: getTextFromTokenized(sentences)
  }))
  let currentIndex = 0
  let locationInString = 0
  let output = null
  console.log(parsed)
  findAreasWithAudioId(parsed, (node, fileName) => {
    let coversParagraphs = []
    const text = getText(node, true, true)
    text.split('').forEach(character => {
      if (currentIndex >= tokenizedParagraphs.length) {
        return
      }
      /*
        Surrounding spaces may have been stripped away.
        Here we just return characters until we see the one we are looking for.
      */
      if (character !== tokenizedParagraphs[currentIndex].text[locationInString]) return;

      /* Fits */
      if (locationInString + character.length === tokenizedParagraphs[currentIndex].text.length) {
        locationInString = 0
        coversParagraphs.push(tokenizedParagraphs[currentIndex].hashOfIds)
        currentIndex++
      }
      /* Continue */
      else {
        locationInString += character.length
      }
    })
    output = {
      audioElementId: fileName, // Random each time
      hash: hash(coversParagraphs), // Relatively stable
      coversParagraphs,
      text,
    }
  })
  console.log(output)
  // store.dispatch({
  //   type: 'AUDIO_SECTIONS',
  //   content: output,
  // })
}

const findAreasWithAudioId = (i, callback) => {
  if (!i) return;
  if (Array.isArray(i)) {
    return i.map(x => findAreasWithAudioId(x, callback))
  } else {
    let { node, tag, attr, child, text } = i
    if (child) {
      if (attr && attr['data-audio-file']) {
        console.warn('------')
        console.warn(child)
        callback(child, attr['data-audio-file'])
      } else {
        child.forEach(x => findAreasWithAudioId(x, callback))
      }
    }
  }
}

export const deleteAudio = (sectionHash) => {
  store.dispatch({
    type: 'DELETE_AUDIO_FILE',
    content: { sectionHash },
  })
}
