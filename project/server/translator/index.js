import string_hash from 'App/functions/hash'
import GoogleTranslate from './GoogleTranslate'
import GetSuggestions from './GetSuggestions'
import GrammaticalAnalysis from 'server/grammatical-analysis'

const request = async ({ list, tokenized, translation, suggestions }, send) => {
  if (!list /*|| !to || !from*/ ) return;

  if (!list || !list.arrayOfAllWordIDs) return;
  let output = {}

  /*
    Grammatical analysis
  */
  // const analysis = await GrammaticalAnalysis(tokenized)
  // console.log(JSON.stringify(analysis))

  /*
    Our translations
  */
  let ourSuggestions = await GetSuggestions({ list, tokenized, translation, suggestions })
  ourSuggestions.forEach(i => {
    output[i.item_id] = [
      ...(output[i.item_id] || []),
      {
        definition: JSON.parse(i.definition)
      }
    ]
  })


  /*
    Google Translate
  */
  /* Temporarily turn off Google Translate except for local development until authentication is solved*/
  if (process.env.TESTING) {
    /* Collect words needing translation */
    let translation_hashes = {}
    list.arrayOfAllWordIDs.forEach(id => {
      if (!translation.words[id] && !output[id]) {
        const hash = string_hash(list.words[id].text)
        const text = list.words[id].text
        translation_hashes[hash] = {
          text
        }
      }
    })
    Object.keys(list.sentences).forEach(id => {
      if (!translation.sentences[id] && !output[id]) {
        const hash = string_hash(list.sentences[id].text)
        const text = list.sentences[id].text
        translation_hashes[hash] = {
          text
        }
      }
    })

    const g = await GoogleTranslate(translation_hashes)
    list.arrayOfAllWordIDs.forEach(id => {
      const hash = string_hash(list.words[id].text)
      // const text = list.words[id].text
      if (g[hash]) {
        output[id] = [{
          definition: {
            meaning: g[hash]
          }
        }]
      }
    })
    Object.keys(list.sentences).forEach(id => {
      const hash = string_hash(list.sentences[id].text)
      // const text = list.sentences[id].text
      if (g[hash]) {
        output[id] = [{
          definition: {
            meaning: g[hash]
          }
        }]
      }
    })
  }

  send({
    type: 'SUGGEST',
    definitions: output,
    // analysis,
  })
}

export default request
