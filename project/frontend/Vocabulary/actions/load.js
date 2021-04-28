/**
 * Request cards from server
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { InitializeSession } from 'Vocabulary/actions/session'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

export default async (input) => {
  const data = (await axios.post(`${url}/api/vocabulary/get`)).data
  InitializeSession(data.map(
    ({ data, ...other }) => ({ ...other, ...JSON.parse(data) })
  ))
}
