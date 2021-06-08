import { notify } from 'User/App/Error'
import axios from 'axios'

axios.defaults.timeout = 3000
axios.interceptors.response.use(
  function (success) {
    return success
  },
  function (error) {
    let message;
    const response = error.response && error.response.data
    if (typeof response === 'object') {
      message = response.message || response.error
    }
    if (typeof message !== 'string') {
      message = 'Server returned an error'
    }
    notify(message, 'error')
    return Promise.reject(error);
  }
)

export default axios
