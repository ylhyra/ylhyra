import { combineReducers } from 'redux'
import { InitializeUser } from './actions'
export const user = (state = InitializeUser(), action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return action.content
    default:
      return state
  }
}
