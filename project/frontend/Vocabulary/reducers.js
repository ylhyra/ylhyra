import { combineReducers } from 'redux'

const card = (state = {
  counter: 0,
}, action) => {
  switch (action.type) {
    case 'LOAD_CARD':
      return {
        ...action.content,
        counter: state.counter + 1
      }
    default:
      return state
  }
}

const status = (state = {
  good: 0,
  ok: 0,
  bad: 0,
  total: 30,
}, action) => {
  switch (action.type) {
    case 'asdf':
      return action.data || state
      // return flattenData(action.data)
    default:
      return state
  }
}

export const vocabulary = combineReducers({
  card,
  status,
})
