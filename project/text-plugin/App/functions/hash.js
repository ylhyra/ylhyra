import hash from 'string-hash'
import stable_stringify from 'json-stable-stringify'

export default function(input) {
  if (typeof input === 'object') {
    input = stable_stringify(input)
  } else if (typeof input !== 'string') {
    input = JSON.stringify(input)
  }
  return hash(input).toString(36)
}
