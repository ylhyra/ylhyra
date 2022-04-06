import { XmlForAeneas } from "ylhyra/content/translationEditor/audioSynchronization/types";
import { arrayIncludesAnyOfOtherArray } from "modules/arrayIncludesAnyOfOtherArray";
import React from "react";

/**
 * Prepare an XML file for audio synchronization.
 * Only leaves id tags on sentences and words.
 */
export const prepareXmlForAeneas = (input, index = 0): XmlForAeneas => {
  if (!input) return null;
  if (Array.isArray(input)) {
    return input.map((x) => prepareXmlForAeneas(x));
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
      if (arrayIncludesAnyOfOtherArray(skipTags, tag)) return null;
      if (tag === "sup") return null;
      let attrs: Record<string, any> = {};
      let Tag = tag || "span";
      if (attr && "data-will-have-audio" in attr) {
        Tag = "span";
        attrs = {
          id: attr?.id,
        };
        if (attrs.id.startsWith("s")) {
          Tag = "div";
        }
        // TEMPORARY; TURNING OFF WORD-LEVEL SYNCHRONIZATION!
        else {
          attrs.id = null;
        }
      }
      if (tag === "root") {
        return child.map((e, i) => prepareXmlForAeneas(e, i));
      }
      if (!child || child.length === 0) return null;
      if (attrs.id) {
        return (
          <Tag {...attrs} key={index}>
            {child?.map((e, i) => prepareXmlForAeneas(e, i))}
          </Tag>
        );
      } else {
        return child?.map((e, i) => prepareXmlForAeneas(e, i));
      }
    } else if (node === "text") {
      return text;
    }
  }
};
const skipTags = ["data-no-audio", "data-ignore"];
