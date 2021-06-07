import axios from 'axios';

export default (options, callback) => {
  let { word, fuzzy, return_rows_if_only_one_match } = options
  axios.get('https://ylhyra.is/api/inflection', {
      params: {
        search: word,
        fuzzy,
        return_rows_if_only_one_match,
      }
    })
    .then(function({ data }) {
      callback(data.results)
    })
    .catch(function(error) {
      callback(null)
      console.log(error);
    })
}
