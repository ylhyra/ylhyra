import query from /*'server/*/ 'database'
import shortid from 'shortid'
import sql from /*'server/*/ 'database/functions/SQL-template-literal'
import cors from 'cors'
import stable_stringify from 'json-stable-stringify'
import send_email from /*'server/*/ 'user/send_email'
import sha256 from 'js-sha256'
const router = (require('express')).Router()
const key = process.env.COOKIE_SECRET || 'secret'
var crypto = require('crypto');
// const SESSION_USER_NAME = 'u'
const SESSION_USER_ID = 'i'

/* Sign up - Step 1: Email */
router.post('/user', async(req, res) => {
  req.session[SESSION_USER_ID] = '123'



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


/* TODO: CSRF */
router.post('/user/logout', async(req, res) => {
  req.session[SESSION_USER_ID] = ''
  return res.sendStatus(200)
})

export default router;
