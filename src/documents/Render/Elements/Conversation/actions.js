import store from 'app/App/store'

let timers = {}

export const start = (section_id) => {
  setTimeout(() => next(section_id), 200)
}

export const next = (section_id) => {
  store.dispatch({
    type: 'CONVERSATION_NEXT',
    section_id,
  })
}

export const submit = (section_id) => {}
export const reset = (section_id) => {}
