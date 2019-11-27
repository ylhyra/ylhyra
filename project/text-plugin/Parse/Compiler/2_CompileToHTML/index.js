import ReactDOMServer from 'react-dom/server'
import Traverse from './Traverse'

export default ({json, data}) => {
  return ReactDOMServer.renderToStaticMarkup(Traverse({json, data, index: 0}) || null)
}
