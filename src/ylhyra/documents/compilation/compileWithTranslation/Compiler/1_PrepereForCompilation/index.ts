import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import MergePunctuation from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/MergePunctuation";
import MergeWords from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/MergeWords";
import {
  removeTempIds,
  tempIds,
} from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/TempIDs";
import { FlattenedData } from "ylhyra/documents/types/types";

/**
 * Minor fixes such as merging words
 */
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
  return output;
}
