const suggestions = (state = {}, action) => {
  let update = {}
  switch (action.type) {
    case 'LOAD_EDITOR':
      return action.content.suggestions || {}
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
