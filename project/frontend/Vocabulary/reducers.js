import { combineReducers } from 'redux'

const deck = (state = null, action) => {
  switch (action.type) {
    case 'LOAD_DECK':
      return action.content
    default:
      return state
  }
}

const session = (state = null, action) => {
  switch (action.type) {
    case 'LOAD_SESSION':
      return action.content
    case 'SCREEN_DONE':
      return null
    default:
      return state
  }
}

const card = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_CARD':
      return {
        ...action.content,
        answered: false,
      }
    case 'ANSWER_CARD':
      return {
        ...state,
        answered: true,
      }
    default:
      return state
  }
}

const status = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_CARD':
      return action.content.status || state
      // return flattenData(action.data)
    default:
      return state
  }
}

const screen = (state = {}, action) => {
  switch (action.type) {
    case 'VOCABULARY_SCREEN':
      return action.content || state
      // return flattenData(action.data)
    default:
      return state
  }
}

export const vocabulary = combineReducers({
  deck,
  session,
  card,
  status,
  screen,
})
