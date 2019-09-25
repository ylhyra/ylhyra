import { combineReducers } from 'redux'

function open(state = false, action) {
  switch (action.type) {
    case 'CARDS':
      return true
    case 'CLOSE':
      return false
    default:
      return state
  }
}

/*
  Each section contains batches of vocabulary cards
*/
function sections(state = {}, action) {
  switch (action.type) {
    case 'CARDS':
      return {
        ...state,
        ...action.content,
      }
    default:
      return state
  }
}

/*
  Tracks progress for each section
*/
function progress(state = {}, action) {
  const { section_id } = action
  switch (action.type) {
    case 'NEXT':
      return {
        ...state,
        [section_id]: (state[section_id]||0) + 1
      }
    case 'RESET':
      return {
        ...state,
        [section_id]: 0
      }
    default:
      return state
  }
}

// /*
//   Tracks score for each section
// */
// function score(state = {}, action) {
//   const { section_id } = action
//   switch (action.type) {
//     case 'SCORE':
//       return {
//         ...state,
//         [section_id]: (state[section_id]||0) + 1
//       }
//     default:
//       return state
//   }
// }

function answers(state = {}, action) {
  const { section_id } = action
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        [section_id]: {
          ...state[section_id],
          ...action.content,
          answered: true,
        }
      }
    case 'NEXT':
    case 'RESET':
      return {
        ...state,
        [section_id]: {
          answered: false,
        }
      }
    default:
      return state
  }
}

export default combineReducers({
  open,
  sections,
  // score,
  progress,
  answers,
})
