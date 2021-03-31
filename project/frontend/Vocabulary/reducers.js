import { combineReducers } from 'redux'

const cards = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_WITH_TOKENIZED_AND_DATA':
      return action.data || state
      // return flattenData(action.data)
    default:
      return state
  }
}
const status = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_WITH_TOKENIZED_AND_DATA':
      return action.data || state
      // return flattenData(action.data)
    default:
      return state
  }
}
export const vocabulary = combineReducers({
  cards,
  status,
})
