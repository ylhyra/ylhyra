import React from "react";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import Link from "ylhyra/app/router/Link";
import GetTemplate from "ylhyra/documents/renderDocument/templates/_list";
import { Jsx } from "modules/typescript/jsx";

export default function Traverse(json: HtmlAsJson, index: Number = 0): Jsx {
  if (!json) return null;
  let { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag: any = tag || "span";
    attr = attr || {};
    if (node === "root") {
      return child.map((e, i) => Traverse(e, i));
    }
    if (tag === "a") {
      Tag = Link;
    } else {
      Tag = GetTemplate(tag) || Tag;
    }

    /* IMG and HR tags are void tags */
    if (voidElementTags.includes(Tag)) {
      return <Tag {...attr} key={attr?.id || index} />;
    }

    /*
      Convert custom elements to 'span' or 'div'
      and add their name as a className
    */
    if (typeof Tag === "string") {
      getCustomTag(Tag, attr?.className, (output) => {
        Tag = output.tag;
        attr.className = output.className;
      });
    }

    return (
      <Tag {...attr} key={attr?.id || index}>
        {child?.map((e, i) => Traverse(e, i))}
      </Tag>
    );
  } else if (node === "text") {
    return text;
  }
}

/*
  Allow for specific custom elements.
*/
const customTags = {
  "p": "div",
  "center": "div",
  "translate": "span",
  "isl": "span",
  "small-box": "span",
};
const getCustomTag = (tag, className, callback) => {
  if (tag in customTags) {
    className = ((className || "") + " " + tag).trim();
    tag = customTags[tag];
  }
  callback({ tag, className });
};

const voidElementTags = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];
