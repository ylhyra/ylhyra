import request from './Greynir-request'
import parse from './Greynir-parse'

export default function(text, callback) {
  request(text, analysis => {
    parse(text, analysis, callback)
  })
}
