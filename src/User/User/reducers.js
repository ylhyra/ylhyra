import { combineReducers } from 'redux'

export const user = (state = {
  name: 'Egill',
  user_id: 2,
}, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return action.content
    default:
      return state
  }
}
