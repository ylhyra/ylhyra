import Precompile from './1_Precompile'
import CompileToHTML from './2_CompileToHTML'
import { reset } from './1_Precompile/UpdateID'
import { html2json, json2html } from 'frontend/App/functions/html2json'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()

const TextCompiler = ({ json, data }) => {
  reset() // TEMP
  let output
  // console.log(json2html(json))
  output = data ? Precompile({ json, data }) : json
  // console.log((data))
  output = CompileToHTML({ json: output, data })
  // console.log((output))
  // output = entities.decode(output)
  return output
}

export default TextCompiler
