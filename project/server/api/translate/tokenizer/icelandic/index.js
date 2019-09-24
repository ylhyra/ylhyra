import request from './request'
import parse from './parse'

export default function(text, callback) {
  request(text, analysis => {
    parse(text, analysis, callback)
  })
}
