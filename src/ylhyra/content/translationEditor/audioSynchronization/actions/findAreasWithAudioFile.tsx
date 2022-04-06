import React from "react";
import { notify } from "ylhyra/app/app/error";
import store from "ylhyra/app/app/store";
import { prepareXmlForAeneas } from "ylhyra/content/translationEditor/audioSynchronization/actions/prepareXmlForAeneas";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { XmlForAeneas } from "ylhyra/content/translationEditor/audioSynchronization/types";

/*
  Note: Allows just a single audio file
*/
export const findAreasWithAudioFile = () => {
  const parsed: HtmlAsJson = store.getState().editor.parsed;
  if (!parsed) {
    return notify(
      "There is no {parsed} for Long audio. Consider turning off server-side rendering."
    );
  }

  // Todo: This must be an error, since there is no way to pass parsed to ReactDOMServer
  // /**
  //  * (We are using some components in the Compile() stage that need to be rendered.)
  //  */
  // const json = html2json(ReactDOMServer.renderToStaticMarkup(parsed));

  const json = parsed;

  let done: Boolean;
  traverseAndFindAreasWithAudioFile(json, (node: HtmlAsJson, filename) => {
    if (done) {
      notify(
        "Only one audio area can be used at a time, for multiple uses you must transclude them."
      );
    } else {
      done = true;
      const XML: XmlForAeneas = prepareXmlForAeneas(node);
      if (!XML || !/<(span|div)/.test(XML)) {
        return notify("Could not create audio XML, no spans found");
      }
      if (XML) {
        store.dispatch({
          type: "AUDIO_AREA",
          filename,
          content: XML,
        });
      }
    }
  });
};

export const traverseAndFindAreasWithAudioFile = (
  input: HtmlAsJson,
  callback: (output: HtmlAsJson, filename: string) => void
): void => {
  let { attr, child } = input;
  if (child) {
    if (attr && attr["data-audio-file"]) {
      callback(input, attr["data-audio-file"]);
    } else {
      child.forEach((x) => traverseAndFindAreasWithAudioFile(x, callback));
    }
  }
};
