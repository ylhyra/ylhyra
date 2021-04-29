/**
 * Save session
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { getNewSchedule } from './schedule'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''


export default async(input) => {
  await axios.post(`${url}/api/vocabulary/save`, {
    data: getNewSchedule(),
  })
}
