// import express from 'express'
// const router = express.Router()
// import query from 'common/database/tagger'
// import { escape as clean } from 'sqlstring'
// import request from 'request'
// import escape_quotes from 'escape-quotes'
// import { AllHtmlEntities as entities } from 'html-entities'
// import BigNumber from 'bignumber.js'
// query(`SET sql_mode = ''`,function(){}) // TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum
//
//
// router.get('/book', (req, res) => {
//   query(`SELECT * FROM content WHERE id = 4`, (err, results) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(500)
//     } else {
//       res.send(results[0])
//     }
//   })
// })
// router.get('/poem', (req, res) => {
//   query(`SELECT * FROM content WHERE id = 200`, (err, results) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(500)
//     } else {
//       res.send(results[0])
//     }
//   })
// })
//
//
//
// router.get('/tweets/approved', (req, res) => {
//   query(`
//       SELECT content.id as id, tweets.id as original_id, original, content.*
//       FROM tweets JOIN content ON tweets.content = content.id
//       WHERE approved = 1 and type = "tweet" and translation IS NOT NULL`, (err, results) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(500)
//     } else {
//       res.send(results)
//     }
//   })
// })
//
//
// router.get('/tweets', (req, res) => {
//   query(`SELECT tweeter, COUNT(tweeter) - COUNT(content.approved) as remaining, COUNT(content.approved) AS approved, original
//          FROM tweets JOIN content ON tweets.content = content.id GROUP BY tweets.tweeter ORDER BY remaining DESC`, (err, results) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(500)
//     } else {
//       res.send(results)
//     }
//   })
// })
//
// router.get('/tweets/user/:id', (req, res) => {
//   var id = req.params.id
//   query(`
//          # Þýtt
//          SELECT content.id as id, tweets.id as original_id, approved, original
//          FROM tweets JOIN content ON tweets.content = content.id
//          WHERE tweeter = ? AND approved = 1;
//
//          # Óþýtt
//          SELECT content.id as id, tweets.id as original_id, approved, original
//          FROM tweets JOIN content ON tweets.content = content.id
//          WHERE tweeter = ? AND (approved != 1 OR approved IS NULL);`, [id, id], (err, results) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(500)
//     } else {
//       res.send(results)
//     }
//   })
// })
//
// router.get('/tweet/:id', function(req, res) {
//   var id = req.params.id
//   request({
//     url: `https://api.twitter.com/1.1/statuses/show/${id}.json?tweet_mode=extended`,
//     headers: {
//       'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAFgQ1AAAAAAAvI5kIfCmRL%2BljkpMFuXjAAOUKCQ%3DEnR5pYSu8nxgsWLCW2o1uEUJ4s44qqzxn8iuYSQtqeg1P5wvib'
//     }
//   }, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       const tweet = parseTweet(JSON.parse(body))
//       query(`SELECT * FROM tweets WHERE id = ${tweet.id}`, (err, results) => {
//         if (err) {
//           console.error(err)
//           res.send(err)
//         } else {
//           if (results.length > 0) {
//             res.sendStatus(303) // Already exists
//           } else {
//             query(`INSERT INTO content SET
//               type = "tweet",
//               raw = ?;
//               SELECT LAST_INSERT_ID() as id;
//               `, [tweet.tweet], (err, results) => {
//               if (err || !results[1][0].id) {
//                 console.error(err)
//                 res.send(err)
//               } else {
//                 query(`INSERT INTO tweets SET id = ?, tweeter = ?, content = ?, original = ?`,
//                       [`_${tweet.id}`, `_${tweet.user.id}`, results[1][0].id, JSON.stringify(tweet)], (err, results) => {
//                   if (err) {
//                     console.error(err)
//                     res.send(err)
//                   } else {
//                     res.sendStatus(201) // Created
//                   }
//                 })
//               }
//             })
//           }
//         }
//       })
//     } else {
//       res.sendStatus(500)
//     }
//   });
// })
//
// const parseTweet = (tweet) => {
//   // console.log(JSON.stringify(tweet,null,2))
//   let text = tweet.full_text
//   if (tweet.entities.media)  {
//     const start = tweet.entities.media[0].indices[0]
//     const end = tweet.entities.media[0].indices[1]
//     text = text.slice(0, start) + text.slice(end)
//   }
//   let photos = []
//   if (tweet.extended_entities) {
//     photos = tweet.extended_entities.media
//       .filter((media) => media.type == 'photo')
//       .map((media) => {
//         return media.media_url_https
//       })
//   }
//   return {
//     user: {
//       name: tweet.user.name,
//       handle: tweet.user.screen_name,
//       picture: tweet.user.profile_image_url_https,
//       verified: tweet.user.verified,
//       id: tweet.user.id_str,
//     },
//     tweet: text.trim(),
//     id: tweet.id_str,
//     date: Date.parse(tweet.created_at),
//     photos: photos,
//     retweets: tweet.retweet_count,
//     favorites: tweet.favorite_count,
//   }
// }
// export default router;
//
// // Credit: https://stackoverflow.com/a/4885062
// var MultibyteToEntities = (function() {
//   function surrogatePairToCodePoint(charCode1, charCode2) {
//     return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
//   }
//   return function(str) {
//     var codePoints = [],
//       i = 0,
//       charCode;
//     while (i < str.length) {
//       charCode = str.charCodeAt(i);
//       if ((charCode & 0xF800) == 0xD800) {
//         codePoints.push('&#' + surrogatePairToCodePoint(charCode, str.charCodeAt(++i)));
//       } else {
//         codePoints.push(str.charAt(i));
//       }
//       ++i;
//     }
//     return codePoints.join('');
//   }
// })();
