import ReactDOMServer from 'react-dom/server'
import Traverse from './Traverse'

export default ({ json, data }) => {
  console.log(data.sentences)


  return (Traverse({ json, data, index: 0 }) || null)
  // return ReactDOMServer.renderToStaticMarkup(Traverse({json, data, index: 0}) || null)
}
