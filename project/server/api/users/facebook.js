import axios from 'axios'
import { login_url } from 'config.js'

let FacebookAccessToken = null

if(!process.env.FACEBOOK_APP_ID) {
  console.error('Missing FACEBOOK_APP_ID in .env')
}

const GetFacebookAccessToken = () => {
  return new Promise(async resolve => {

    if (FacebookAccessToken) {
      resolve(FacebookAccessToken)
    } else {
      const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env
      if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
        throw ('You must have FACEBOOK_APP_ID and FACEBOOK_APP_SECRET set in your envs')
      }
      try {
        const { access_token } = (await axios.get(`https://graph.facebook.com/oauth/access_token`, {
          params: {
            client_id: FACEBOOK_APP_ID,
            client_secret: FACEBOOK_APP_SECRET,
            redirect_uri: login_url,
            grant_type: 'client_credentials',
          }
        })).data
        FacebookAccessToken = access_token
        resolve(FacebookAccessToken)
      } catch (e) {
        console.error(e)
        throw ("Couldn't ask Facebook for an access token")
      }
    }

  })
}

export default GetFacebookAccessToken
