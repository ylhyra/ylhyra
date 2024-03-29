import { html2json } from "app/app/functions/html2json";
import { AllHtmlEntities as Entities } from "html-entities";
import ExtractData from "documents/parse/ExtractData";
import ExtractText from "documents/parse/ExtractText/ExtractText";
import Tokenizer from "documents/parse/Tokenize";
import WrapInTags from "documents/parse/WrapInTags";
import Compiler from "documents/parse/Compiler";
import { notify } from "app/app/error";
import isEmpty from "is-empty-object";

const entities = new Entities();

/*
  Parser
*/
export default ({ html }) => {
  if (!html) return null;
  // console.log(html)
  try {
    // var t0 = now()
    html = entities.decode(html);
    html = html
      .replace(/[\s\n\r]+/g, " ") // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
      .replace(/\u00AD/g, " ") // Soft-hyphens
      .replace(/\u00A0/g, " "); // Non-breaking spaces
    let json = html2json(html);

    // console.log(html)
    // var t1 = now()
    // console.log(`html2json took ${Math.round(t1 - t0)} ms`)

    /*
      Is data already saved?
    */
    let data = ExtractData(json);
    // console.log(data)
    /*
      Extract text, group by documents
    */
    const text = ExtractText(json);
    // console.log({text})
    // var t3 = now()
    // console.log(`Extracting text took ${Math.round(t3 - t2)} ms`)
    if (isEmpty(text)) {
      // console.warn('No text to tokenize.')
      // json = html2json(entities.decode(json2html(json)))
      return { parsed: Compiler({ json }) };
      // return html2json(Compiler({ json: wrapped, data: data, }))
    }
    const tokenized = Tokenizer(text, data);
    // console.log({ text, tokenized });
    // var t4 = now()
    // console.log(`Tokenization took ${Math.round(t4 - t3)} ms`)
    const flattenedData = flattenData(data);

    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    // console.log(json2html(json));
    const wrapped = WrapInTags({ json, tokenized });
    // console.log(json2html(wrapped));
    // console.log({wrapped})
    // var t5 = now()
    // console.log(`Wrapping took ${Math.round(t5 - t4)} ms`)
    // console.log(json2html(wrapped))
    let compiled = Compiler({ json: wrapped, data: flattenedData });
    // var t6 = now()
    // console.log(`Compilation took ${Math.round(t6 - t5)} ms`)
    // console.log(`total ${Math.round(t6 - t0)} ms`)
    // compiled = entities.decode(compiled)
    // console.log(JSON.stringify(compiled,null,2))
    return {
      parsed: compiled, // JSON object
      // parsed: html2json(compiled),
      tokenized,
      data,
      flattenedData,
    };
    // return compiled
  } catch (e) {
    console.error(e);
    if (typeof mw !== "undefined") {
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
    // console.log(input[documentTitle])
    output = merge(output, input[documentTitle]);
  }
  // console.log(output);
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
