import Precompile from './1_Precompile'
import CompileToHTML from './2_CompileToHTML'
import { reset } from './1_Precompile/UpdateID'

const TextCompiler = ({ json, data }) => {
  reset() // TEMP
  let output
  output = Precompile({ json, data })
  // console.log(output)
  output = CompileToHTML({ json: output, data })
  return output
}

export default TextCompiler
