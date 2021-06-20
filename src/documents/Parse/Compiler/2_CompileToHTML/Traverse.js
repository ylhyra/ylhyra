import React from "react";
import Sentence from "documents/Parse/Compiler/2_CompileToHTML/Sentence";
import Word from "documents/Parse/Compiler/2_CompileToHTML/Word";
import ReactDOMServer from "react-dom/server";
import ReactTraverse from "documents/Render/Traverse";
const Traverse = ({ json, data, index }) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag = tag;

    let extraAttributes = {};
    if (tag === "word") {
      Tag = Word;
      extraAttributes = { editor: data };
    } else if (tag === "sentence") {
      Tag = Sentence;
    }
    if (Tag) {
      const output = (
        <Tag key={(attr && attr.id) || index} {...extraAttributes}>
          {child && child.map((e, i) => Traverse({ json: e }))}
        </Tag>
      );
      return {
        node: "text",
        text: ReactDOMServer.renderToStaticMarkup(output),
      };
    } else {
      return {
        ...json,
        child:
          child &&
          child
            .map((e, i) => Traverse({ json: e, data, index: i }))
            .filter(removeNulls),
      };
    }
  }
  return json;
};

const removeNulls = (i) => {
  return i !== null && typeof i !== "undefined";
};

export default Traverse;
