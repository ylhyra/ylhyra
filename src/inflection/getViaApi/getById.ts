import axios from "axios";
import { Rows } from "inflection/tables/types";

export default (id: number, callback: (parameter: Rows | null) => any) => {
  axios
    .get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
    .then(function ({ data }) {
      // console.log(data)
      callback(data.results);
    })
    .catch(function (error) {
      console.log(error);
      callback(null);
    });
};
