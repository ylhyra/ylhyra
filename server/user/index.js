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

/* Sign up - Step 1: Email */
router.post('/user', async(req, res) => {
  const { email } = req.body

  const short_token = ('0000' + parseInt(crypto.randomBytes(2).toString('hex'), 16).toString()).slice(-4)
  const long_token = crypto.randomBytes(6).toString('hex')
  // const derived_key = GetDerivedKey(short_token, long_token)
  const expires = (new Date()).getTime() + 2 * 60 * 60 * 1000 /* Two hours */

  if (!email || !email.trim() || email.length > 255) {
    return res.send({ error: 'ERROR_INVALID_EMAIL' })
  }

  /* TODO: Captcha */

  query(sql `INSERT INTO user_login_tokens SET
    email       = ${email.trim()},
    short_token = ${short_token},
    long_token  = ${long_token},
    expires     = ${expires}
    `, (err, results) => {
    if (err) {
      console.error(err)
      return res.sendStatus(500)
    } else {
      return res.send({ long_token })
    }
  })
})

/* Sign up - Step 2: Token */
router.post('/user/token', async(req, res) => {
  const { token, long_token } = req.body

  query(sql `SELECT * FROM user_login_tokens WHERE
    -- short_token = ${token} AND -- TEMP!!!!!
    long_token  = ${long_token}
    `, (err, results) => {
    if (err) {
      console.error(err)
      return res.sendStatus(500)
    } else {

      if (results.length < 1) {
        return res.send({ error: 'ERROR_INVALID_TOKEN' })
      } else if (parseInt(results[0].expires) < (new Date()).getTime()) {
        return res.send({ error: 'ERROR_EXPIRED_TOKEN' })
      }

      /* Success, create user */
      query(sql `INSERT INTO users SET
        email = ${results[0].email}
        `, (err, results2) => {
        if (err) {
          console.error(JSON.stringify(err.code))
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(500).send({ error: 'ERROR_USER_ALREADY_EXIST' })
          }
          return res.sendStatus(500)
        } else {
          const user_id = results2.insertId
          const user = results[0].email
          req.session.user_id = user_id
          req.session.user = user
          return res.send({ user_id, user })
        }
      })
    }
  })
})

// const GetDerivedKey = (x, y) => {
//   return sha256.hmac(key, x + '' + y)
// }

/* TODO: CSRF */
router.post('/user/logout', async(req, res) => {
  req.session.user = ''
  req.session.user_id = ''
  return res.sendStatus(200)
})

export default router;
