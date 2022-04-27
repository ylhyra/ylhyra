import axios from "axios";
import { OutputWithLicense, SearchOptions } from "inflection/server/types";

export default (
  options: SearchOptions,
  callback: (parameter: OutputWithLicense["results"]) => any
) => {
  let { word, fuzzy, return_rows_if_only_one_match } = options;
  axios
    .get("https://ylhyra.is/api/inflection", {
      params: {
        search: word,
        fuzzy,
        return_rows_if_only_one_match,
      },
    })
    .then(function ({ data }: { data: OutputWithLicense }) {
      callback(data.results);
    })
    .catch(function (error) {
      callback(null);
      console.log(error);
    });
};
