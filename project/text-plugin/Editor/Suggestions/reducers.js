/*
  Documentation:
  https://ylhyra.is/Manual:Suggestions
*/
const suggestions = (state = {}, action) => {
  let update = {}
  switch (action.type) {
    case 'LOAD_EDITOR':
      return action.content.suggestions || {}
    case 'SUGGEST':
      /* Suggest translation */
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
    // case 'SUGGEST_ANALYSIS':
    //   /* Suggest analysis */
    //   action.suggestions.forEach(item => {
    //
    //   })
    //   return {
    //     ...state,
    //     ...update,
    //   }
    case 'GOOGLE_TRANSLATE':
      Object.keys(action.translation).forEach(id => {
        update[id] = [
          ...state[id] || [],
          {
            definition: {
              meaning: action.translation[id],
            }
          }
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
