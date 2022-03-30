import { HtmlAsJson } from "app/app/functions/html2json/types";
import MergePunctuation from "documents/parse/Compiler/1_Precompile/MergePunctuation";
import MergeWords from "documents/parse/Compiler/1_Precompile/MergeWords";
import {
  removeTempIds,
  tempIds,
} from "documents/parse/Compiler/1_Precompile/TempIDs";
import { FlattenedData } from "documents/parse/types";
// import PronunciationAndSound from './PronunciationAndSound'
// import WrapInTags from 'Editor/2-Parse/2.3-WrapInTags'

export default function Compile({
  json,
  data,
}: {
  json: HtmlAsJson;
  data: FlattenedData;
}): HtmlAsJson {
  let output = json;
  output = tempIds(output);
  output = MergeWords(output, data.translation);
  output = MergePunctuation(output, data.translation);
  output = removeTempIds(output);
  /* Disabled due to audio sync */
  // output = NiceIDs(output /*data.id*/);
  // console.log(output)
  // console.log(JSON.stringify(output, null, 2))
  return output;
}
