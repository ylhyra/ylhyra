import store from 'App/store'
import hash from 'project/frontend/App/functions/hash'
import test_data from './TestData'
export const BAD = 1
export const OK = 2
export const PERFECT = 3




const data2 = []
test_data.forEach(({ is, en }) => {
  const id = hash(is.trim())
  data2.push({ is, en, from: 'is', belongs_to: id, id: id + '_is' })
  data2.push({ is, en, from: 'en', belongs_to: id, id: id + '_en' })
})

export const load = () => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: data2[0]
  })
}

export const answer = (input) => {
  next()
}

export const next = (input) => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: data2[1]
  })
}
