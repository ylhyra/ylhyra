// @ts-ignore
import isBooleanAttribute from "is-boolean-attribute";
import React from "react";
// @ts-ignore
import convert from "react-attr-converter";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import inlineStyle2Json from "ylhyra/app/app/functions/inline-style-2-json";

/**
 * - Converts certain HTML attributes to React attributes
 * - Opens external links in new window
 */
export const PrepareJSONForReact = (json: HtmlAsJson): HtmlAsJson => {
  // if (!json) return null;
  let { node, tag, attr, child, text } = json;
  if (attr?.id === null) {
    delete attr.id;
  }
  if (node === "element" || node === "root") {
    /**
     * Attribute values in {@link HtmlAsJson} can be arrays
     * Here we merge them together with spaces
     */
    let attrConverted: any = {};
    for (const property of Object.keys(attr || {})) {
      // Converts HTML attribute into React attribute
      if (attr && property in attr && !property.startsWith("data-temp")) {
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
      Always open external links in a new window
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
      out.child = child
        .map((e) => PrepareJSONForReact(e))
        .filter((i) => i !== null && typeof i !== "undefined");
    }
    if (Object.keys(attrConverted).length > 0) {
      out.attr = attrConverted;
    }

    out.tag = tag?.toLowerCase() || tag; //GetTemplate(tag) || tag;

    return out;
  } else if (node === "text") {
    return json;
  } else {
    return {};
  }
};
