// @ts-nocheck
/*
  TODO: Remove - Rarely used
*/
export function getParameters(input) {
  let parameters = [];
  let values = [];
  for (var key of Object.keys(input)) {
    if (input[key] !== undefined /*&& input[key] !== null*/) {
      parameters.push(`${key} = ?`);
      values.push(input[key]);
    }
  }
  return {
    parameters: parameters.join(", "),
    values,
  };
}
