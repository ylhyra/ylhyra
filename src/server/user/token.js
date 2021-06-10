import query from 'server/database'
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import stable_stringify from 'json-stable-stringify'
import send_email from 'server/user/send_email'
import sha256 from 'js-sha256'
import request from 'request'
const router = (require('express')).Router()
const key = process.env.COOKIE_SECRET || 'secret'
var crypto = require('crypto');


/* Sign up - Step 1: Email */
router.post('/user', async(req, res) => {
  const username = req.body.username && req.body.username.trim().replace(/\s+/g, ' ')
  const email = req.body.email && req.body.email.trim()
  const { password, captcha_token } = req.body

  if (!email || email.length > 255) {
    return res.send({ error: 'ERROR_INVALID_EMAIL' })
  }

  captcha(captcha_token, res, () => {
    const short_token = ('0000' + parseInt(crypto.randomBytes(2).toString('hex'), 16).toString()).slice(-4)
    const long_token = crypto.randomBytes(8).toString('hex')
    const expires = (new Date()).getTime() + 2 * 60 * 60 * 1000 /* Two hours */

    query(sql `INSERT INTO user_login_tokens SET
      email       = ${email},
      short_token = ${short_token},
      long_token  = ${long_token},
      expires     = ${expires};

      SELECT * FROM users WHERE email = ${email};
      `, async(err, results) => {
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      } else {
        const does_user_exist = await get_user(email)
        return res.send({ long_token, does_user_exist })
      }
    })
  })
})

/* Sign up - Step 2: Token */
router.post('/user/token', async(req, res) => {
  const { token, long_token } = req.body

  query(sql `SELECT * FROM user_login_tokens WHERE
    long_token  = ${long_token}
    `, async(err, results) => {
    if (err) {
      console.error(err)
      return res.sendStatus(500)
    } else {

      if (results.length < 1) {
        return res.send({ error: 'ERROR_INVALID_TOKEN' })
      } else if (results[0].short_token !== token) {
        if (results[0].attempts < 3) {
          query(sql `UPDATE user_login_tokens SET
            attempts = ${results[0].attempts + 1}
            WHERE long_token  = ${long_token}`, (err, r) => {})
          return res.send({ error: 'ERROR_INVALID_TOKEN' })
        } else {
          return res.send({ error: 'ERROR_EXPIRED_TOKEN' })
        }
      } else if (parseInt(results[0].expires) < (new Date()).getTime()) {
        return res.send({ error: 'ERROR_EXPIRED_TOKEN' })
      }

      const email = results[0].email
      const user = await get_user(email)

      create_user_if_doesnt_exist({ user, email, res }, userid => {
        const username = email
        req.session.user = { userid, username }
        return res.send({ userid, username })
      })
    }
  })
})

const get_user = async(email) => {
  return new Promise(resolve => {
    query(sql `SELECT * FROM users WHERE email = ${email}`, (err, results) => {
      if (results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    })
  })
}

const create_user_if_doesnt_exist = ({ user, email, res }, callback) => {
  if (user) {
    return callback(user.id)
  }
  query(sql `INSERT INTO users SET
    email = ${email}
    `, (err, results2) => {
    if (err) {
      console.error(JSON.stringify(err.code))
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(500).send({ error: 'ERROR_USER_ALREADY_EXIST' })
      }
      return res.sendStatus(500)
    } else {
      callback(results2.insertId)
    }
  })
}

const captcha = (captcha_token, res, callback) => {
  if (!process.env.REACT_APP_HCAPTCHA_SITEKEY) {
    return callback()
  }
  if (!captcha_token) {
    return res.send({ error: 'ERROR_INCORRECT_CAPTCHA' })
  }
  request.post({
    url: 'https://hcaptcha.com/siteverify',
    form: {
      response: captcha_token,
      secret: process.env.HCAPTCHA_SECRET,
    }
  }, (error, response, body) => {
    if (error) {
      console.error(error)
      return res.sendStatus(500)
    } else if (JSON.parse(body).success !== true) {
      return res.send({ error: 'ERROR_INCORRECT_CAPTCHA' })
    }
    callback()
  })
}

// const GetDerivedKey = (x, y) => {
//   return sha256.hmac(key, x + '' + y)
// }

/* TODO: CSRF */
router.post('/user/logout', async(req, res) => {
  req.session.user = null
  return res.sendStatus(200)
})

export default router;
