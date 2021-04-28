/**
 * Save session
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

export default async (input) => {
  await axios.post(`${url}/api/vocabulary/save`, {
    data: store.getState().vocabulary.session.cards.map(card => {
      return {
        id: card.id,
        history: card.history,
      }
    }),
    withCredentials: true,
  })
}
