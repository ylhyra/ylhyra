import _ from 'underscore'
import store from 'App/store'
import { combineReducers } from 'redux'
import { wordsHash } from 'Editor/Translator/actions'
require('App/functions/sortByArray')

/*
  ____       _           _   _
 / ___|  ___| | ___  ___| |_(_) ___  _ __
 \___ \ / _ \ |/ _ \/ __| __| |/ _ \| '_ \
  ___) |  __/ |  __/ (__| |_| | (_) | | | |
 |____/ \___|_|\___|\___|\__|_|\___/|_| |_|   */
export const selected = (state = [], action) => {
  switch (action.type) {
    case 'SELECT_WORD':
      // Eru mörg orð í þessu vali?
      if (action.contains) {
        return action.contains
      } else if (action.id) {
        if (action.adding) {
          const arrayOfAllWordIDs = store.getState().editor.list.arrayOfAllWordIDs
          return state = _.uniq([action.id, ...state]).sortByArray(arrayOfAllWordIDs)
        } else {
          return state = [action.id]
        }
      }
      return state
    case 'CLEAR_SELECTION':
    case 'CONFIRM_DEFINITION':
    case 'DELETE_WORD':
      return state = []
    default:
      return state
  }
}


/*
  _____                    _       _   _
 |_   _| __ __ _ _ __  ___| | __ _| |_(_) ___  _ __
   | || '__/ _` | '_ \/ __| |/ _` | __| |/ _ \| '_ \
   | || | | (_| | | | \__ \ | (_| | |_| | (_) | | | |
   |_||_|  \__,_|_| |_|___/_|\__,_|\__|_|\___/|_| |_|  */
const init = {
  sentences: {},
  words: {},
  definitions: {},
}
export const translation = (state = init, action) => {
  switch (action.type) {

    case 'TOKENIZED':
      if (action.currentDocumentData) {
        return action.currentDocumentData.translation
      } else {
        return init
      }

    case 'UPDATE_SENTENCE':
      {
        let { sentence_id, content } = action
        return {
          ...state,
          sentences: {
            ...state.sentences,
            [sentence_id]: content,
          }
        }
      }

    case 'UPDATE_SENTENCE_VALUE':
      {
        let { sentence_id, fieldName, value } = action
        return {
          ...state,
          sentences: {
            ...state.sentences,
            [sentence_id]: {
              ...(state.sentences[sentence_id] || {}),
              [fieldName]: value
            }
          }
        }
      }

      /*
        Update entire definition
      */
    case 'UPDATE_DEFINITION':
      {
        const { definition, selected } = action
        const hash = wordsHash(selected)
        let words = {}
        for (let id of selected) {
          words[id] = hash
        }
        return {
          ...state,
          words: {
            ...state.words,
            ...words
          },
          definitions: {
            ...state.definitions,
            [hash]: {
              contains: selected,
              ...definition,
            }
          },
        }
      }

      /*
        Update just one field in definition
      */
    case 'UPDATE_DEFINITION_VALUE':
      {
        const { name, value, selected } = action
        const hash = wordsHash(selected)
        let words = {}
        for (let id of selected) {
          words[id] = hash
        }
        return {
          ...state,
          words: {
            ...state.words,
            ...words
          },
          definitions: {
            ...state.definitions,
            [hash]: {
              ...state.definitions[hash],
              contains: selected,
              [name]: value,
            }
          },
        }
      }

    case 'SUGGEST_ANALYSIS':
      {
        console.log(action.suggestions)
        return state
        // let words = state.words
        // let definitions = state.definitions
        // const {suggestions} = action
        // suggestions.forEach(suggestion => {
        //   const {definition, selected } = suggestion
        //   const hash = wordsHash(selected)
        //   for (let id of selected) {
        //     words[id] = hash
        //   }
        //   definitions[hash] = {
        //     ...definitions[hash],
        //     contains: selected,
        //     ...definition,
        //   }
        // })
        // return {
        //   ...state,
        //   words,
        //   definitions,
        // }
      }

    case 'DELETE_WORD':
      {
        const words = state.words
        const definitions = state.definitions
        const definitionId = words[action.id]
        const definition = definitions[definitionId]

        if (!definition) {
          return state
        }
        definition.contains.forEach(word => {
          delete words[word]
        })
        delete definitions[definitionId]
        return {
          ...state,
          words: {
            ...words
          },
          definitions: {
            ...definitions
          },
        }
      }

    default:
      return state
  }
}
