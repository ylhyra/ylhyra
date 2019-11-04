import { newTitle } from 'Parse/index.js'
import { AllHtmlEntities as Entities } from 'html-entities'
import axios from 'axios'
const entities = new Entities()

/*
  Extract the data which is stored in the Data: namespace (is encoded in [[Template:Start]])

  Returns an object containing:
    DocumentTitle => Data
*/
const ExtractData = (input) => {
  let data = {}
  const getNewTitle = new newTitle()
  Traverse(input, async ({ documentTitle, url }) => {
    const title = getNewTitle.get(documentTitle)
    const { data } = await axios.get(`https://ylhyra.is/index.php?title=${url}&action=raw&ctype=text/json`)
    console.log(data)
    // data[title] = updateIDs(output.data, title)
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
  if (attr && attr['data-document-start'] && attr['data-data']) {
    try {
      const url = attr['data-data']
      console.warn(url)
      // const encodedData = attr['data-data']
      // const data = JSON.parse(entities.decode(decodeURIComponent(encodedData)))
      url && callback({
        documentTitle: attr['data-document-start'],
        // data,
        url,
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
