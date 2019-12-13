export const data = (state = {}, action) => {
  switch (action.type) {
    case 'TOKENIZED':
      return action.data
      // return flattenData(action.data)
    default:
      return state
  }
}
