import React from "react";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { Jsx } from "modules/typescript/jsx";
import ReactDOMServer from "react-dom/server";
import { XmlForAeneas } from "ylhyra/documents/translationEditor/audioSynchronization/types";

/**
 * Prepare an XML file for audio synchronization.
 * Only leaves id tags on sentences and words.
 */
export const prepareXmlForAeneas = (input: HtmlAsJson): XmlForAeneas => {
  /** Render to string */
  let output = ReactDOMServer.renderToStaticMarkup(traverse(input));
  /** Add a newline after sentences (just for formatting reasons) */
  output = output.replace(/(<\/div>)/g, "</div>\n");
  return output;
};

/**
 * Returns a JSX element
 */
export const traverse = (input: HtmlAsJson, index = 0): Jsx => {
  if (!input) return null;
  if (Array.isArray(input)) {
    return input.map((x) => traverse(x));
  } else {
    const { node, tag, attr, child, text } = input;
    if (node === "element" || node === "root") {
      if (
        attr &&
        ("data-no-audio" in attr ||
          "data-type" in attr ||
          "data-children" in attr ||
          "data-not-text" in attr)
      )
        return null;
      if (tag && skipTags.includes(tag)) return null;
      if (tag === "sup") return null;
      let attrs: Record<string, any> = {};
      let Tag = tag || "span";
      if (attr && "data-will-have-audio" in attr) {
        attrs = {
          id: attr?.id,
        };
        /** Sentences become divs */
        if (attrs.id.startsWith("s")) {
          Tag = "div";
        }
        // TEMPORARY; TURNING OFF WORD-LEVEL SYNCHRONIZATION!
        else {
          attrs.id = null;
        }
      }
      if (tag === "root") {
        return child!.map((e, i) => traverse(e, i));
      }
      if (!child || child.length === 0) return null;
      if (attrs.id) {
        return (
          // @ts-ignore
          <Tag {...attrs} key={index}>
            {child?.map((e, i) => traverse(e, i))}
          </Tag>
        );
      } else {
        return child?.map((e, i) => traverse(e, i));
      }
    } else if (node === "text") {
      return text;
    }
  }
};
const skipTags = ["data-no-audio", "data-ignore"];
