import React from "react";
import ReactDOMServer from "react-dom/server";
import { notify } from "ylhyra/app/app/error";
import { html2json } from "ylhyra/app/app/functions/html2json";
import store from "ylhyra/app/app/store";
import { prepareXmlForAeneas } from "ylhyra/content/translationEditor/audioSynchronization/actions/prepareXmlForAeneas";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

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
  /**
   * Render document.
   * (We are using some components in the Compile() stage that need to be rendered.)
   */
  const json = html2json(ReactDOMServer.renderToStaticMarkup(parsed));

  let done: Boolean;
  findAreasWithAudioFile(json, (node: HtmlAsJson, filename) => {
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

export const findAreasWithAudioFile = (
  input: HtmlAsJson,
  callback: (output: HtmlAsJson, filename: string) => void
): void => {
  let { attr, child } = input;
  if (child) {
    if (attr && attr["data-audio-file"]) {
      callback(input, attr["data-audio-file"]);
    } else {
      child.forEach((x) => findAreasWithAudioFile(x, callback));
    }
  }
};
