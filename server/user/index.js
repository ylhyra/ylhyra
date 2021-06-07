import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import stable_stringify from 'json-stable-stringify'
import send_email from 'server/user/send_email'
const key = process.env.COOKIE_SECRET || 'secret'
var crypto = require('crypto');

router.post('/user', async(req, res) => {
  const {
    username,
    email,
    password,
  } = req.body

  return res.send({
    user: ':)'
  })
})

router.get('/user', async(req, res) => {
  const { email } = req.query
  const short_token = ('0000' + parseInt(crypto.randomBytes(2).toString('hex'), 16).toString()).slice(-4)
  const long_token = crypto.randomBytes(6).toString('hex')

  return res.send({ short_token, long_token })
})

// router.get('/user', async(req, res) => {
//   send_email()
//
//   return res.send({
//     user: ':)'
//   })
// })


export default router;
