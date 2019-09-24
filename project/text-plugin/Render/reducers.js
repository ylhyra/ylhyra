// export const documents = (state = {}, action) => {
//   switch (action.type) {
//     case 'TOKENIZED':
//       return action.allDocuments
//     default:
//       return state
//   }
// }

export const translations = (state = {}, action) => {
  switch (action.type) {
    case 'TOKENIZED':
      return state
      // return flattenData(action.data)
    default:
      return state
  }
}
