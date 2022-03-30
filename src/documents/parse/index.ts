import { notify } from "app/app/error";
import { html2json } from "app/app/functions/html2json";
import { isBrowser } from "app/app/functions/isBrowser";
import Compiler from "documents/parse/Compiler";
import ExtractData from "documents/parse/ExtractData";
import { flattenData } from "documents/parse/ExtractData/flattenData";
import ExtractText from "documents/parse/ExtractText/ExtractText";
import Tokenizer from "documents/parse/Tokenize";
import WrapInTags from "documents/parse/WrapInTags";
import { AllHtmlEntities as Entities } from "html-entities";
import isEmpty from "is-empty-object";

const entities = new Entities();

/*
  Parser
*/
export default ({ html }: { html: string }) => {
  if (!html) return null;

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
  }
};
