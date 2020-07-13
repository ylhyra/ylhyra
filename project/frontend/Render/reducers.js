export const data = (state = {}, action) => {
  switch (action.type) {
    case 'INITIALIZE_WITH_TOKENIZED_AND_DATA':
      return action.data || state
      // return flattenData(action.data)
    default:
      return state
  }
}
