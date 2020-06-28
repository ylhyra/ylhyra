/*
  TODO: Remove - Rarely used
*/
function getParameters(input) {
  let parameters = []
  let values = []
  for (var key in input) {
    if(input[key] !== undefined /*&& input[key] !== null*/) {
      parameters.push(`${key} = ?`)
      values.push(input[key])
    }
  }
  return {
    parameters: parameters.join(', '),
    values,
  }
}
module.exports = getParameters
