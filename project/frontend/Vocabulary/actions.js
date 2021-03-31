import store from 'App/store'
import hash from 'project/frontend/App/functions/hash'
import test_data from './TestData'
export const BAD = 1
export const OK = 2
export const PERFECT = 3

export const load = () => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: {
      is: 'hehe',
      en: 'hihi',
      from: 'is',
    }
  })
}

export const answer = (input) => {
}
