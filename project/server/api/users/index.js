import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import axios from 'axios'
import GetFacebookAccessToken from './facebook'


/*
  The frontend will get a response from Facebook.com
  after the user logs in. This data is then sent
  to this URL.
*/
router.post('/user/login', async (req, res) => {

  // console.log(req.body)

  // See if request includes Facebook access token
  if (!req.body.accessToken) {
    res.status(401) // Unauthorized
    res.send({
      error: 'No access token'
    }) // TODO
    return
  }

  // Generate Access Token
  const FacebookAccessToken = await GetFacebookAccessToken()
  if (!FacebookAccessToken) {
    res.status(401)
    res.send({
      error: "Couldn't generate token"
    })
    return
  }

  const response = (await axios.get(`https://graph.facebook.com/debug_token`, {
    params: {
      input_token: req.body.accessToken,
      access_token: FacebookAccessToken,
    }
  })).data

  // console.log(response)

  if (response.data.is_valid && response.data.user_id === req.body.userID) {
    // console.log(response)
    getUserId(req, res, (id) => {
      updateSession(req, res, id, () => {
        const user = {
          id,
          name: req.body.name,
          first_name: req.body.first_name, // TODO Ég er ekki enn að biðja um þetta í framendanum.
          picture: req.body.picture.data.url,
        }
        // res.cookie('id', user.id)
        // res.cookie('name', user.name)
        // res.cookie('picture', user.picture)

        req.session.user_id = id
        req.session.user = user
        res.send(user)



        query(`
          UPDATE documents SET owner = ? WHERE owner = ?;
          UPDATE revisions SET updated_by = ? WHERE updated_by = ?;
          `, [
          id, req.session.id,
          id, req.session.id,
        ], (err, results) => {

        })

      })
    })
  } else {
    res.status(401) // Unauthorized
    res.send({
      error: 'Invalid token'
    })
  }
})

const getUserId = (req, res, callback) => {
  query(`
    SELECT id FROM users WHERE facebook_user_id = ?
  `, [
    req.body.userID,
  ], (err, results) => {
    if (err) {
      console.error(err)
      res.send({
        type: 'error',
        message: 'Error when getting user ID',
      })
    } else {
      if (results.length > 0) {
        updateUser(req, res, results[0].id, callback)
      } else {
        insertUser(req, res, callback)
      }
    }
  })
}

const insertUser = (req, res, callback) => {
  query(`
    INSERT INTO users SET
      facebook_user_id = ?,
      email = ?,
      name = ?,
      picture = ?
  `, [
    req.body.userID,
    req.body.email,
    req.body.name,
    req.body.picture.data.url,
  ], (err, results) => {
    if (err) {
      console.error(err)
      res.send({
        type: 'error',
        message: 'Error when inserting user.',
      })
    } else {
      if (results.length > 0) {
        callback(results[0].id)
      } else {
        res.send({
          type: 'error',
          message: 'Could not insert user. No user inserted.',
        })
      }
    }
  })
}

const updateUser = (req, res, id, callback) => {
  query(`
    UPDATE users SET
      facebook_user_id = ?,
      email = ?,
      name = ?,
      picture = ?
      WHERE id = ?
  `, [
    req.body.userID,
    req.body.email,
    req.body.name,
    req.body.picture.data.url,
    id,
  ], (err, results) => {
    if (err) {
      console.error(err)
      res.send({
        type: 'error',
        message: 'Error when updating user',
      })
    } else {
      callback(id)
    }
  })
}

const updateSession = (req, res, id, callback) => {
  if (!req.session.id) {
    callback()
    return
  }

  query(`
    UPDATE user_sessions SET
      user_id = ?
      WHERE session_id = ?;
  `, [
    id,
    req.session.id,
  ], (err, results) => {
    if (err) {
      console.error(err)
      res.send({
        type: 'error',
        message: 'Error when updating session',
      })
    } else {
      callback()
    }
  })
}



router.post('/user/logout', (req, res) => {
  req.session.destroy((err) => {
    res.send('ok :)')
  })
})

export default router;
