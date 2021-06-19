import React, { lazy } from "react";
import Sentence from "documents/Render/TextElements/Sentence";
import Word from "documents/Render/TextElements/Word";
import convert from "react-attr-converter";
import inlineStyle2Json from "app/App/functions/inline-style-2-json";
import isBooleanAttribute from "is-boolean-attribute";

// import Controls from './Controls/Controls'
// import AudioPlayer from './Controls/Audio'

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
    if (tag === "word") {
      Tag = Word;
    } else if (tag === "sentence") {
      Tag = Sentence;
    } else if (tag === "a") {
      Tag = Link;
    } else {
      Tag = GetTemplate(tag) || Tag;
    }

    /*
      Attribute values can be arrays (from html2json).
      Here we merge them together with spaces
    */
    let attrs = {};
    for (const property in attr) {
      // Converts HTML attribute into React attribute
      if (property in attr && !property.startsWith("data-temp")) {
        const value = attr[property];
        if (property === "style") {
          attrs[convert(property)] = inlineStyle2Json(value);
        } else {
          attrs[convert(property)] = value;
          if (value === "true" || value === "false") {
            attrs[convert(property)] = value === "true" ? true : false;
          }
          if (
            value === "" &&
            (isBooleanAttribute(property) ||
              ["autoplay", "loop"].includes(property))
          ) {
            attrs[convert(property)] = true;
          }
        }
      }
    }

    /* IMG and HR tags are void tags */
    if (voidElementTags.includes(Tag)) {
      return <Tag {...attrs} key={(attr && attr.id) || index} />;
    }

    /*
      Convert custom elements to 'span' or 'div'
      and add their name as a className
    */
    if (typeof Tag === "string") {
      getCustomTag(Tag, attrs.className, (output) => {
        Tag = output.tag;
        attrs.className = output.className;
      });
    }

    /*
      Always open links in a new window
    */
    if (tag === "a" && attrs.href && attrs.href.startsWith("http")) {
      // attrs.target = "_blank"
      attrs.rel = "noopener";
    }

    let extraAttributes = {};
    if (tag === "word") {
      extraAttributes = { editor: data };
    }

    return (
      <Tag {...attrs} key={(attr && attr.id) || index} {...extraAttributes}>
        {/* {Audio} */}
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
