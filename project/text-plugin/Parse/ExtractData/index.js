/*
  Extract the data which is stored in the Data: namespace (is encoded in [[Template:Start]])

  Returns an object containing:
    DocumentTitle => Data
*/
const ExtractData = (input) => {
  let data = {}
  Traverse(input, (output) => {
    data[output.documentTitle] = output.data
  })
  return data
}

const Traverse = (input, callback) => {
  const { node, tag, attr, child, text } = input
  if (typeof input === 'string') return;
  if (node === 'text') return;
  if (Array.isArray(input)) {
    return input.map(i => Traverse(i, callback))
  }
  if (input.child) {
    input.child.map(i => Traverse(i, callback))
  }
  if (attr && attr['data-document-start'] && child && child[0] && child[0].node === 'text') {
    callback({
      documentTitle: attr['data-document-start'],
      data: JSON.parse(child[0].text)
    })

  }
}
export default ExtractData
