import MergeWords from "documents/parse/Compiler/1_Precompile/MergeWords";
import MergePunctuation from "documents/parse/Compiler/1_Precompile/MergePunctuation";
import {
  RemoveTempIDs,
  TempIDs,
} from "documents/parse/Compiler/1_Precompile/TempIDs";
// import PronunciationAndSound from './PronunciationAndSound'
// import WrapInTags from 'Editor/2-Parse/2.3-WrapInTags'

const Compile = ({ json, data }) => {
  let output = json;
  output = TempIDs(output);
  output = MergeWords(output, data.translation);
  output = MergePunctuation(output, data.translation);
  output = RemoveTempIDs(output);
  /* Disabled due to audio sync */
  // output = NiceIDs(output /*data.id*/);
  // console.log(output)
  // console.log(JSON.stringify(output, null, 2))
  return output;
};

export default Compile;
