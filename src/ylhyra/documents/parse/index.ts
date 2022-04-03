import { AllHtmlEntities as Entities } from "html-entities";
import isEmpty from "is-empty-object";
import { isBrowser } from "modules/isBrowser";
import { notify } from "ylhyra/app/app/error";
import { html2json } from "ylhyra/app/app/functions/html2json";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import Compiler from "ylhyra/documents/parse/Compiler";
import ExtractData from "ylhyra/documents/parse/ExtractData";
import { flattenData } from "ylhyra/documents/parse/ExtractData/flattenData";
import ExtractText from "ylhyra/documents/parse/ExtractText/ExtractText";
import Tokenizer from "ylhyra/documents/parse/Tokenize";
import {
  DocumentTitleToFlattenedData,
  DocumentTitleToTokenizedParagraphsWithIds,
  FlattenedData,
} from "ylhyra/documents/parse/types";
import WrapInTags from "ylhyra/documents/parse/WrapInTags";

const entities = new Entities();

/*
  Parser
*/
export default ({
  html,
}: {
  html: string;
}): {
  parsed?: HtmlAsJson;
  tokenized?: DocumentTitleToTokenizedParagraphsWithIds;
  data?: DocumentTitleToFlattenedData;
  flattenedData?: FlattenedData;
} => {
  if (!html) return {};

  try {
    html = entities.decode(html);
    html = html
      .replace(/[\s\n\r]+/g, " ") // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
      .replace(/\u00AD/g, " ") // Soft-hyphens
      .replace(/\u00A0/g, " "); // Non-breaking spaces
    let json = html2json(html);

    /*
      Is data already saved?
    */
    let data = ExtractData(json);

    /*
      Extract text, group by documents
    */
    const text = ExtractText(json);

    if (isEmpty(text)) {
      return { parsed: Compiler({ json }) };
    }
    const tokenized = Tokenizer(text, data);
    const flattenedData = flattenData(data);

    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    const wrapped = WrapInTags(json, tokenized);
    let compiled = Compiler({ json: wrapped, data: flattenedData });

    return {
      parsed: compiled,
      tokenized,
      data,
      flattenedData,
    };
  } catch (e) {
    console.error(e);
    if (isBrowser) {
      notify("Error in parse step");
    }
    return {};
  }
};