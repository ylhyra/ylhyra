import query from /*'server/*/ 'database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from /*'server/*/ 'database/functions/SQL-template-literal'
import cors from 'cors'
import stable_stringify from 'json-stable-stringify'
import send_email from /*'server/*/ 'user/send_email'
const key = process.env.COOKIE_SECRET || 'secret'
var crypto = require('crypto');
import sha256 from 'js-sha256'

/* Sign up - Step 1: Email */
router.post('/user', async(req, res) => {
  const { email } = req.body
  const short_token = ('0000' + parseInt(crypto.randomBytes(2).toString('hex'), 16).toString()).slice(-4)
  const long_token = crypto.randomBytes(6).toString('hex')
  const derived_key = GetDerivedKey(short_token, long_token)

  return res.send({ short_token, long_token, derived_key })
})

/* Sign up - Step 2: Token */
router.post('/user/signup/token', async(req, res) => {
  const { token } = req.body

  return res.send('')
})

const GetDerivedKey = (x, y) => {
  return sha256.hmac(key, x + '' + y)
}

// router.get('/user', async(req, res) => {
//   send_email()
//
//   return res.send({
//     user: ':)'
//   })
// })


export default router;
