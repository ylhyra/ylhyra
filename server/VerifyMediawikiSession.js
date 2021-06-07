/*
  Allow Ylhýra's server to verify that a user is logged in on Mediawiki.
*/
import axios from 'axios'
let url = process.env.MEDIAWIKI_TESTING ? 'http://localhost' : 'https://ylhyra.is'

export default (session_verification_token, is_login_site) => {
  if (is_login_site) { url = 'https://login.ylhyra.is' }
  return new Promise(async(resolve, reject) => {
    const { session_verification } = (await axios.get(`${url}/api.php`, {
      params: {
        action: 'session_verification',
        format: 'json',
        token: session_verification_token,
      }
    })).data

    let allowed_age = 2 * 60
    if (process.env.NODE_ENV === `development`) {
      allowed_age = 100 * 24 * 60 * 60
    }

    if (session_verification.success && session_verification.token_age_in_seconds < allowed_age) {
      const { data } = await axios.get(`${url}/api.php`, {
        params: {
          ususerids: session_verification.userID,
          action: 'query',
          format: 'json',
          list: 'users',
          usprop: 'groups',
        }
      })
      resolve(data.query?.users[0])
    } else {
      resolve(null)
    }
  })
}
