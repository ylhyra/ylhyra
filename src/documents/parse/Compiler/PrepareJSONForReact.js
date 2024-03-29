/**
 * Converts certain HTML attributes to React attributes
 */
import React from "react";
import convert from "react-attr-converter";
import inlineStyle2Json from "app/app/functions/inline-style-2-json";
import isBooleanAttribute from "is-boolean-attribute";
import { removeNulls } from "documents/parse/Compiler/2_CompileToHTML/Traverse";

const Traverse = (json) => {
  if (!json) return null;
  let { node, tag, attr, child, text } = json;
  if (attr?.id === null) {
    delete attr.id;
  }
  if (node === "element" || node === "root") {
    /*
      Attribute values can be arrays (from html2json).
      Here we merge them together with spaces
    */
    let attr_converted = {};
    for (const property of Object.keys(attr || {})) {
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
      out.child = child.map((e) => Traverse(e)).filter(removeNulls);
    }
    if (Object.keys(attr_converted).length > 0) {
      out.attr = attr_converted;
    }

    out.tag = tag?.toLowerCase() || tag; //GetTemplate(tag) || tag;

    return out;
  } else if (node === "text") {
    return json;
  }
};

export default Traverse;
