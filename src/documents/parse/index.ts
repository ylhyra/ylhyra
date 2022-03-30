import { notify } from "app/app/error";
import { html2json } from "app/app/functions/html2json";
import { isBrowser } from "app/app/functions/isBrowser";
import Compiler from "documents/parse/Compiler";
import ExtractData from "documents/parse/ExtractData";
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
    const wrapped = WrapInTags({ json, tokenized });
    let compiled = Compiler({ json: wrapped, data: flattenedData });

    return {
      parsed: compiled, // JSON object
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

const flattenData = (input) => {
  let output = {
    translation: {
      definitions: {},
      sentences: {},
      words: {},
    },
    list: {
      arrayOfAllItemIDs: [],
      arrayOfAllWordIDs: [],
      items: {},
      sentences: {},
      words: {},
    },
    short_audio: {
      soundList: [],
      sounds: {},
      wordID_to_text: {},
    },
    long_audio: {},
  };

  for (const documentTitle of Object.keys(input)) {
    output = merge(output, input[documentTitle]);
  }

  return output;
};

const merge = (first, second) => {
  if (Array.isArray(first)) {
    return [...first, ...second];
  } else if (typeof first === "object") {
    let output = first;
    if (second && typeof second === "object") {
      for (const key of Object.keys(second)) {
        if (output[key]) {
          output[key] = merge(output[key], second[key]);
        } else {
          output[key] = second[key];
        }
      }
    }
    return output;
  }
};

/*
  Prevent clashes if the same document is transcluded twice
*/
export class newTitle {
  index = 0;
  array = [];
  get(title) {
    if (this.array.includes(title)) {
      title = this.get(title + "1");
    }
    this.array.push(title);
    return title;
  }
}
