import { HtmlAsJson } from "app/app/functions/html2json/types";
import Sentence from "documents/parse/Compiler/2_CompileToHTML/Sentence";
import Word from "documents/parse/Compiler/2_CompileToHTML/Word";
import React from "react";

const Traverse = ({
  json,
  data,
  index,
}: {
  json: HtmlAsJson;
  data: Object;
  index?: Number;
}) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag: any = tag;
    if (node === "root") {
      return child.map((e, i) => Traverse({ json: e, index: i, data }));
    }
    let extraAttributes = {};
    if (tag === "word") {
      Tag = Word;
      extraAttributes = { editor: data };
    } else if (tag === "sentence") {
      Tag = Sentence;
    }
    if (Tag) {
      return (
        <Tag key={attr?.id || index} {...extraAttributes} {...attr}>
          {child?.map((e, i) => Traverse({ json: e, index: i, data }))}
        </Tag>
      );
    }
  } else if (node === "text") {
    return text;
  }
};

export const removeNulls = (i) => {
  return i !== null && typeof i !== "undefined";
};

export default Traverse;
