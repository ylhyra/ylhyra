// id = "844721596359159811"
//
//
// https://api.twitter.com/1.1/statuses/show/844721596359159811

// const host = process.env.NODE_ENV === 'production' ? location.host : 'localhost:8000'
import { send } from 'Editor/web-socket'

window.getTweet = (id) => {
  send({ type: 'TWEET', id, })
}

const tweet = (data) => {
  console.log(data)
}
export default tweet

// getTweet('844721596359159811')
// /api/tweets/844721596359159811
