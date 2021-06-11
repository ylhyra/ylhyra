export const route = (state = {
  pathname: 'MAIN',
}, action) => {
  switch (action.type) {
    case 'ROUTE':
      return action.content
    default:
      return state
  }
}
