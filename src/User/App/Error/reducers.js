export default (state = null, action) => {
  switch (action.type) {
    case 'ERROR':
      return action.content
    default:
      return state
  }
}
