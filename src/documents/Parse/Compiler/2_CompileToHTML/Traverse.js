import React from "react";
import Sentence from "documents/Parse/Compiler/2_CompileToHTML/Sentence";
import Word from "documents/Parse/Compiler/2_CompileToHTML/Word";
import ReactDOMServer from "react-dom/server";
import ReactTraverse from "documents/Render/Traverse";
const Traverse = ({ json, data, index }) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag;
    let extraAttributes = {};
    if (tag === "word") {
      extraAttributes = { editor: data };
    }

    if (attr.id === null) {
      delete attr.id;
    }

    if (tag === "word") {
      Tag = Word;
    } else if (tag === "sentence") {
      Tag = Sentence;
    }
    if (Tag) {
      const output = (
        <Tag {...attr} key={(attr && attr.id) || index} {...extraAttributes}>
          {child && child.map((e, i) => ReactTraverse({ json: e }))}
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
