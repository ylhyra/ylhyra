export default class SQL_helper {
  constructor() {
    this.queries = "";
    this.values = [];
  }
  query(input) {
    /*
      Some of our queries can be too large for MySQL to handle. (Error: "max_allowed_packet")
      We put a limit to the length of queries and thus force the frontend
      to only request a limited amount of suggestions at a time.
    */
    if (this.queries.length + input[0] > 3000) {
      return;
    }

    this.queries += input[0];
    this.values = this.values.concat(input[1]);
  }
  getQueries() {
    return this.queries;
  }
  getValues() {
    return this.values;
  }
}
