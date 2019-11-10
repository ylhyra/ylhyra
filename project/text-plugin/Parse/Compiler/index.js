import Precompile from './1_Precompile'
import CompileToHTML from './2_CompileToHTML'
import { reset } from './1_Precompile/UpdateID'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()

const TextCompiler = ({ json, data }) => {
  reset() // TEMP
  let output
  // console.log(json2html(json))
  output = Precompile({ json, data })
  console.log((output))
  output = CompileToHTML({ json: output, data })
  // output = entities.decode(output)
  // console.log(output)
  return output
}

export default TextCompiler
