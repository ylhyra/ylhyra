const suggestions = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
      return action.content.suggestions || {}
    case 'SUGGEST':
      let update = {}
      Object.keys(action.content).forEach(id => {
        update[id] = [
          ...state[id] || [],
          ...action.content[id] || [],
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
