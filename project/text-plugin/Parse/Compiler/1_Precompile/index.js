import MergeWords from './MergeWords'
import MergePunctuation from './MergePunctuation'
import NiceIDs from './NiceIDs'
import { TempIDs, RemoveTempIDs } from './TempIDs'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
// import PronunciationAndSound from './PronunciationAndSound'
// import WrapInTags from 'Editor/2-Parse/2.3-WrapInTags'


const Compile = ({ json, data }) => {
  let output = json
  output = TempIDs(output)
  output = MergeWords(output, data.translation)
  output = MergePunctuation(output, data.translation)
  output = RemoveTempIDs(output)
  // output = NiceIDs(output, data.id)
  // console.log(output)
  // console.log(JSON.stringify(output, null, 2))
  return output
}

export default Compile
