import store from 'App/store'
import GoogleTranslate from './GoogleTranslate'
import { get_ISO_639_1 } from 'project/server/datasets/languages'
// import { saveEditor } from 'Editor/actions'
require('App/functions/array-foreach-async')

export default async () => {
  return;

  const { suggestions, list, translation } = store.getState().editor
  const { items, arrayOfAllItemIDs } = list
  // const { from, to } = store.getState().editor.metadata
  // const sourceLang = get_ISO_639_1(from)
  // const targetLang = get_ISO_639_1(to)
  // if (!IsAvailableOnGoogleTranslate(from, to)) return;
  const sourceLang = 'is'
  const targetLang = 'en'
  // return;
  /*
    Loop over all items (words & wentences)
  */
  await arrayOfAllItemIDs
    .filter(id => !(id in suggestions))
    .filter(id => !(id in translation.words) && !(id in translation.sentences))
    // .slice(0, 5)
    .forEachAsync(async (id) => {

      await new Promise(async resolve => {
        const translations = await GoogleTranslate({
          input: items[id].text,
          sourceLang,
          targetLang,
          // sentenceSuggestions: editor.suggestions[items[itemID].belongsToSentence] // TODO ADD AGAIN
        })
        if (translations) {
          /*
            Save suggestions
          */
          store.dispatch({
            type: 'SUGGEST',
            content: {
              [id]: translations.map(translation => ({
                definition: {
                  meaning: translation,
                }
              }))
            },
          })
        }
        resolve()
      })
    })
  // saveEditor()
}

/*
  TODO:
  List of available languages isn't finished.
*/
export const IsAvailableOnGoogleTranslate = (from, to) => {
  const AvailableLanguages = [
    'en',
    'is',
    'de',
    'es',
    'fr',
    'da',
    'sv',
    'no',

    'af',
    'sq',
    'am',
    'ar',
    'hy',
    'az',
    'eu',
    'be',
    'bn',
    'bs',
    'bg',
    'ca',
    'TODO!! FINISH LIST',
  ]
  return get_ISO_639_1(from) && get_ISO_639_1(to) &&
    AvailableLanguages.includes(get_ISO_639_1(from)) &&
    AvailableLanguages.includes(get_ISO_639_1(to))
}
