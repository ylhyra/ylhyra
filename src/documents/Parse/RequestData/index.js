import { newTitle } from 'documents/Parse/index.js'
import { AllHtmlEntities as Entities } from 'html-entities'
import axios from 'app/App/axios'
const entities = new Entities()
require('app/App/functions/array-foreach-async')

/*
  Makes an HTTP request to fetch the relevant data in the Data: namespace (link encoded in in [[Template:Start]])
  It is only possible to transclude the data for small documents.

  Returns an object containing:
    DocumentTitle => Data
*/
const ExtractData = async (input) => {
  let output = {}

  return output
  


  const getNewTitle = new newTitle()
  let temp = []
  Traverse(input, ({ documentTitle, url }) => {
    temp.push({ documentTitle, url })
  })
  await temp.forEachAsync(async ({ documentTitle, url }) => {
    const title = getNewTitle.get(documentTitle)
    // Random is added to bypass cache
    const { data } = await axios.get(`https://ylhyra.is/index.php?title=&action=raw&ctype=text/json&random=${Math.random()}`)
    // console.log(data)
    output[title] = updateIDs(data, title)
  })
  return output
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
  if (attr && attr['data-document-start'] && attr['data-data']) {
    try {
      const url = attr['data-data']
      // console.warn(url)
      // const encodedData = attr['data-data']
      // const data = JSON.parse(entities.decode(decodeURIComponent(encodedData)))
      url && callback({
        documentTitle: attr['data-document-start'],
        // data,
        url,
      })
    } catch (e) {
      // console.error(child[0].text + ' is not parseable JSON')
      console.error(e)
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
