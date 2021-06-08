import { combineReducers } from 'redux'

export const user = (state = null, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return action.content
    default:
      return state
  }
}
