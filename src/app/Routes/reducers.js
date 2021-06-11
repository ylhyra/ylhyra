import { getURL } from 'app/Routes/actions'
const route = (state = getURL(), action) => {
  switch (action.type) {
    case 'ROUTE':
      return action.content
    default:
      return state
  }
}
