export const route = (state = {
  pathname: '/',
}, action) => {
  switch (action.type) {
    case 'ROUTE':
      return action.content
    default:
      return state
  }
}
