/**
 * Converts certain HTML attributes to React attributes
 */
import React, { lazy } from "react";
import convert from "react-attr-converter";
import inlineStyle2Json from "app/App/functions/inline-style-2-json";
import isBooleanAttribute from "is-boolean-attribute";

const Traverse = ({ json, data, index }) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    /*
      Attribute values can be arrays (from html2json).
      Here we merge them together with spaces
    */
    let attr_converted = {};
    for (const property in attr) {
      // Converts HTML attribute into React attribute
      if (property in attr && !property.startsWith("data-temp")) {
        const value = attr[property];
        if (property === "style") {
          attr_converted[convert(property)] = inlineStyle2Json(value);
        } else {
          attr_converted[convert(property)] = value;
          if (value === "true" || value === "false") {
            attr_converted[convert(property)] = value === "true" ? true : false;
          }
          if (
            value === "" &&
            (isBooleanAttribute(property) ||
              ["autoplay", "loop"].includes(property))
          ) {
            attr_converted[convert(property)] = true;
          }
        }
      }
    }

    /*
      Always open links in a new window
    */
    if (
      tag === "a" &&
      attr_converted.href &&
      attr_converted.href.startsWith("http")
    ) {
      // attr_converted.target = "_blank"
      attr_converted.rel = "noopener";
    }

    let out = json;
    if (child) {
      out.child = child.map((e, i) => Traverse({ json: e }));
    }
    if (Object.keys(attr_converted).length > 0) {
      out.attr = attr_converted;
    }

    return out;
  }
  return json;
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
