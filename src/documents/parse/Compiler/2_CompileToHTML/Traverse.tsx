import { HtmlAsJson } from "app/app/functions/html2json/types";
import Sentence from "documents/parse/Compiler/2_CompileToHTML/Sentence";
import Word from "documents/parse/Compiler/2_CompileToHTML/Word";
import React from "react";

/**
 * Returns a JSX-type object
 */
const Traverse = ({
  json,
  index,
}: {
  json: HtmlAsJson;
  index?: Number;
}): any => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag: any = tag;
    if (node === "root") {
      return child?.map((e, i) => Traverse({ json: e, index: i }));
    }
    if (tag === "word") {
      Tag = Word;
    } else if (tag === "sentence") {
      Tag = Sentence;
    }
    if (Tag) {
      return (
        <Tag key={attr?.id || index} {...attr}>
          {child?.map((e, i) => Traverse({ json: e, index: i }))}
        </Tag>
      );
    }
  } else if (node === "text") {
    return text;
  } else {
    return null;
  }
};

export default Traverse;
