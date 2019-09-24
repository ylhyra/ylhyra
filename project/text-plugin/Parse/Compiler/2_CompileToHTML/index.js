import ReactDOMServer from 'react-dom/server'
import Traverse from './Traverse'

export default ({json}, input) => {
  return ReactDOMServer.renderToStaticMarkup(Traverse(json, 0, input) || null)
}
