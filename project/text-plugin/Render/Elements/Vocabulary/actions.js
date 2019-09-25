import store from 'text-plugin/store'

export const close = () => {
  store.dispatch({
    type: 'CLOSE',
  })
}

export const start = () => {
  store.dispatch({
    type: 'CARDS',
    content: []
  })
}

export const submitAnswer = ({ correct, index, section_id }) => {
  if(typeof section_id === 'undefined') {
    console.warn('Section_id undefined!')
  }
  if (store.getState().vocabulary.answers[section_id]?.answered) {
    // next(id)
    return null
  }

  // console.log({correct, index, section_id })

  store.dispatch({
    type: 'ANSWER',
    section_id,
    content: {
      correct,
      selected_index: index,
    }
  })

  setTimeout(() => {
    store.dispatch({
      type: 'NEXT',
      section_id
    })
  }, 3000)
}
