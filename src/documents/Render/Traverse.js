import React, { lazy } from "react";
import GetTemplate from "documents/Templates/_list";
import Link from "app/Router/Link";

const Traverse = ({ json, data, index }) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag = tag || "span";
    if (node === "root") {
      return child.map((e, i) => Traverse({ json: e, index: i, data }));
    }
    if (tag === "a") {
      Tag = Link;
    } else {
      Tag = GetTemplate(tag) || Tag;
    }

    /* IMG and HR tags are void tags */
    if (voidElementTags.includes(Tag)) {
      return <Tag {...attr} key={(attr && attr.id) || index} />;
    }

    /*
      Convert custom elements to 'span' or 'div'
      and add their name as a className
    */
    if (typeof Tag === "string") {
      getCustomTag(Tag, attr.className, (output) => {
        Tag = output.tag;
        attr.className = output.className;
      });
    }

    return (
      <Tag {...attr} key={(attr && attr.id) || index}>
        {child && child.map((e, i) => Traverse({ json: e, data, index: i }))}
      </Tag>
    );
  } else if (node === "text") {
    return text;
  }
};

export default Traverse;

/*
  Allow for specific custom elements.
*/
const customTags = {
  p: "div",
  center: "div",
  translate: "span",
  isl: "span",
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
