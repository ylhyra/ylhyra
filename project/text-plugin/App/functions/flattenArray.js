const flattenArray = (data) => {
  var r = []
  data.forEach(e => Array.isArray(e) ? r = r.concat(flattenArray(e)) : r.push(e));
  return r;
}
export default flattenArray
