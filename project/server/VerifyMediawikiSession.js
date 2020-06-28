/*

  (Work in progress)
  Allow Ylhýra's server to verify that a user is logged
  in by sending their cookies to Mediawiki.
  (This is a hack.)

*/

const router = (require('express')).Router()
import axios from 'axios'

const verifySession = async (req, res) => {
  const { data } = await axios.get('https://ylhyra.is/api.php?action=query&format=json&meta=userinfo&uiprop=groups', {

  })
  console.log(data)

  res.sendStatus(200)
}
