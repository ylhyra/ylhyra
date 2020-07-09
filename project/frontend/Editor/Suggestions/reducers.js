const suggestions = (state = {}, action) => {
  let update = {}
  switch (action.type) {
    case 'TOKENIZED':
      // console.warn(action)
      return action.currentDocumentData?.suggestions || {}
    case 'SUGGEST':
      /* Suggest translation */
      Object.keys(action.definitions).forEach(id => {
        update[id] = [
          ...(state[id] || []),
          ...(action.definitions[id] || []),
        ]
      })
      return {
        ...state,
        ...update,
      }
    default:
      return state
  }
}

export default suggestions
