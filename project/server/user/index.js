import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import verifySession from 'server/VerifyMediawikiSession'
import stable_stringify from 'json-stable-stringify'
import sha256 from 'js-sha256'
// import scrypt from 'scrypt-js'
// const Cryptr = require('cryptr');
// const cryptr = new Cryptr(process.env.COOKIE_SECRET || 'secret');
const key = process.env.COOKIE_SECRET || 'secret'

router.post('/user', async(req, res) => {
  const session_verification_token = req.body.token
  const user = await verifySession(session_verification_token, true)
  if (!user) {
    return res.status(400).send('Failed verification. Please <a href="mailto:ylhyra@ylhyra.is">contact support</a>.')
  }
  const { userid, name } = user
  const data = {
    userid,
    name,
    timestamp: (new Date()).getTime(),
  }
  const signature = sha256.hmac(key, stable_stringify(data))

  // req.session.user = data

  return res.send({
    user: data,
    signature,
  })
})

export const GetUser = (data) => {
  if (!data) return;
  const { user, signature } = data
  if (sha256.hmac(key, stable_stringify(user)) !== signature) return;
  return user;
}

export default router;
