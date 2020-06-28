/*
  Requests text analysis from
  [Greynir](https://greynir.is/analysis),
  a sentence analyzer for Icelandic
  by Vilhjálmur Þorsteinsson.
*/

import query from 'server/database'
import hash from 'string-hash'
import request from 'request'
const lang = 'isl'

export default function(text, callback) {
  const text_hash = hash(text).toString(36)
  query(`SELECT * FROM analysis WHERE lang = ? AND text_hash = ?`, [lang, text_hash], (err, results) => {
    if (err) {
      console.error(err)
      callback(null)
    } else {
      if (results.length > 0) {
        callback(JSON.parse(results[0].analysis))
      } else {
        request.post({
          url: 'https://greynir.is/postag.api/v1',
          form: {
            text: text
          }
        }, (error, response, body) => {
          // console.log(body)
          if (error) {
            console.error(err)
            callback(null)
          } else {
            query(`INSERT INTO analysis SET
              lang = ?,
              text_hash = ?,
              text = ?,
              analysis = ?;
              `, [lang, text_hash, text, JSON.stringify(JSON.parse(body))], (err, results) => {
              if (err) {
                console.error(err)
                callback(null)
              } else {
                callback(body)
              }
            })
          }
        })
      }
    }
  })
}
