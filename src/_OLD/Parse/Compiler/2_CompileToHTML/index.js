import ReactDOMServer from 'react-dom/server'
import Traverse from './Traverse'

export default ({ json, data }) => {
  return (Traverse({ json, data, index: 0 }) || null)
  // return ReactDOMServer.renderToStaticMarkup(Traverse({json, data, index: 0}) || null)
}
