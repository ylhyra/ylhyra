export const inflection = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_INFLECTION':
      return action.content
    default:
      return state
  }
}
