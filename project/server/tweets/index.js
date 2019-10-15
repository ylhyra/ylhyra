import express from 'express'
const router = express.Router()
import request from 'request'
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_API_TOKEN,
  access_token_secret: process.env.TWITTER_API_TOKEN_SECRET,
})

router.get('/tweet/:id', function(req, res) {
  var id = req.params.id
  client.get('statuses/show', { id }, function(error, tweets, response) {
    if (!error) {
      res.send(parseTweet(tweets))
    } else {
      res.sendStatus(500)
    }
  })
})

const parseTweet = (tweet) => {
  // console.log(JSON.stringify(tweet,null,2))
  let text = tweet.text
  if (tweet.entities.media) {
    const start = tweet.entities.media[0].indices[0]
    const end = tweet.entities.media[0].indices[1]
    text = text.slice(0, start) + text.slice(end)
  }
  let photos = []
  if (tweet.extended_entities) {
    photos = tweet.extended_entities.media
      .filter((media) => media.type == 'photo')
      .map((media) => {
        return media.media_url_https
      })
  }
  return {
    user: {
      name: tweet.user.name,
      handle: tweet.user.screen_name,
      picture: tweet.user.profile_image_url_https,
      verified: tweet.user.verified,
      id: tweet.user.id_str,
    },
    tweet: text.trim(),
    id: tweet.id_str,
    date: Date.parse(tweet.created_at),
    photos: photos,
    retweets: tweet.retweet_count,
    favorites: tweet.favorite_count,
  }
}
export default router;
