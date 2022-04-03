import { arrayIncludesAnyOfOtherArray } from "modules/arrayIncludesAnyOfOtherArray";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { notify } from "ylhyra/app/app/error";
import { html2json } from "ylhyra/app/app/functions/html2json";
import store from "ylhyra/app/app/store";

/*
  Allows just a single audio file
*/
export default () => {
  const { parsed } = store.getState().editor;
  if (!parsed) {
    return notify(
      "There is no {parsed} for Long audio. Consider turning off server-side rendering."
    );
  }
  /*
    TEMPORARY SOLUTION.
    EXTREMELY HACKY.
    We are using some components in the Compile() stage that need to be rendered for this to work.
  */
  const json = html2json(ReactDOMServer.renderToStaticMarkup(parsed));

  let done;
  findAreasWithAudioFile(json, (node, filename) => {
    if (done) {
      notify(
        "Only one audio area can be used at a time, for multiple uses you must transclude them."
      );
    } else {
      done = true;
      const XML = prepareXmlForAeneas(node);
      const output = ReactDOMServer.renderToStaticMarkup(XML).replace(
        /(<\/div>)/g,
        "</div>\n"
      );
      console.log({ output });
      if (!output || !/<(span|div)/.test(output)) {
        return notify(
          "Could not create audio XML, no spans found. Check Long_audio/actions.js"
        );
      }
      if (XML) {
        store.dispatch({
          type: "AUDIO_AREA",
          filename,
          content: output,
        });
      }
    }
  });
};

const findAreasWithAudioFile = (i, callback) => {
  if (!i) return;
  if (Array.isArray(i)) {
    return i.map((x) => findAreasWithAudioFile(x, callback));
  } else {
    let { attr, child } = i;
    if (child) {
      if (attr && attr["data-audio-file"]) {
        callback(child, attr["data-audio-file"]);
      } else {
        child.forEach((x) => findAreasWithAudioFile(x, callback));
      }
    }
  }
};

/**
 * Prepare an XML file for audio synchronization.
 * Only leaves id tags on sentences and words.
 */
const prepareXmlForAeneas = (input, index = 0) => {
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
