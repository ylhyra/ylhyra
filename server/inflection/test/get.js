import Word from './../tables/word'
import get_by_id from './../server/server-standalone/get_by_id'

/*
  Testing helper function
  Callback is a Word
*/
let cache = {}
export const get = (id, done, input_function, dont_keep_in_cache) => {
  if (cache[id]) {
    try {
      input_function(new Word(cache[id]))
    } catch (error) {
      done(error)
    }
  } else {
    get_by_id(id, (server_results) => {
      if (server_results === null) {
        throw new Error('Server request failed')
        return;
      }
      if (!dont_keep_in_cache) {
        cache[id] = server_results
      }
      try {
        input_function(new Word(server_results))
      } catch (error) {
        console.log(error)
        done(error)
      }
    })
  }
}
