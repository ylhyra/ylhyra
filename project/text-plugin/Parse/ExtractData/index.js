import { newTitle } from 'Parse/index.js'

/*
  Extract the data which is stored in the Data: namespace (is encoded in [[Template:Start]])

  Returns an object containing:
    DocumentTitle => Data
*/
const ExtractData = (input) => {
  let data = {}
  const getNewTitle = new newTitle()
  Traverse(input, (output) => {
    const title = getNewTitle.get(output.documentTitle)
    data[title] = updateIDs(output.data, title)
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
    console.log(child[0].text)
    try {
      const data = JSON.parse(child[0].text)
      data && callback({
        documentTitle: attr['data-document-start'],
        data,
      })
    } catch (e) {
      console.error(child[0].text + ' is not parseable JSON')
    }
  }
}
export default ExtractData

/*
  //TODO!
  Prepend title to all IDs to prevent clashing
*/
const updateIDs = (data, title) => {
  // console.log(data)
  return data
}
