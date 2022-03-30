/**
 * Converts certain HTML attributes to React attributes
 */
import inlineStyle2Json from "app/app/functions/inline-style-2-json";
import { removeNulls } from "documents/parse/Compiler/2_CompileToHTML/Traverse";
import isBooleanAttribute from "is-boolean-attribute";
import React from "react";
import convert from "react-attr-converter";
import { HtmlAsJson } from "app/app/functions/html2json/types";

const Traverse = (json: HtmlAsJson) => {
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
    let attrConverted: any = {};
    for (const property of Object.keys(attr || {})) {
      // Converts HTML attribute into React attribute
      if (property in attr && !property.startsWith("data-temp")) {
        const value = attr[property];
        if (property === "style") {
          attrConverted[convert(property)] = inlineStyle2Json(value);
        } else {
          attrConverted[convert(property)] = value;
          if (value === "true" || value === "false") {
            attrConverted[convert(property)] = value === "true" ? true : false;
          }
          if (
            value === "" &&
            (isBooleanAttribute(property) ||
              ["autoplay", "loop"].includes(property))
          ) {
            attrConverted[convert(property)] = true;
          }
        }
      }
    }

    /*
      Always open links in a new window
    */
    if (
      tag === "a" &&
      attrConverted.href &&
      attrConverted.href.startsWith("http")
    ) {
      // attr_converted.target = "_blank"
      attrConverted.rel = "noopener";
    }

    let out = json;
    if (child) {
      out.child = child.map((e) => Traverse(e)).filter(removeNulls);
    }
    if (Object.keys(attrConverted).length > 0) {
      out.attr = attrConverted;
    }

    out.tag = tag?.toLowerCase() || tag; //GetTemplate(tag) || tag;

    return out;
  } else if (node === "text") {
    return json;
  }
};

export default Traverse;
