/*
  .  . .  .    ,
  |  | |  |-. . . ,-. ,-.
  |  | |  | | | | |   ,-|
  `--| `' ' ' `-| '   `-^
  .- |         /|
  `--'        `-'
  YLhýra - Plugin for reading annotated texts
*/
import { fix_inline_translations } from 'Render/Text/InlineTranslations/InlineTranslations/'

import "core-js/stable";
import "regenerator-runtime/runtime";

require('Render/Text/Touch/')
require('Render/Style/index.styl')
require('./DevelopmentMode')
require('Source_editor/Tweets')

import Parse from 'text-plugin/Parse'
import Render from 'text-plugin/Render'
import Editor from 'Editor'
import Source_editor from 'Source_editor'
export const host = process.env.NODE_ENV === 'production' ? location.host : 'localhost:9123'
import store from 'App/store'
import ReactDOMServer from 'react-dom/server'
var now = require("performance-now")

/*
  Temporary silly way of waiting until jQuery is ready
*/
const documentReady = (fn) => {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(() => checkIfjQueryIsReady(fn), 1);
  } else {
    document.addEventListener("DOMContentLoaded", () => checkIfjQueryIsReady(fn))
  }
}

function checkIfjQueryIsReady(fn) {
  if (!window.jQuery || !mw || !mw.util) return setTimeout(() => checkIfjQueryIsReady(fn), 50);
  fn()
}


documentReady(() => {
  /*
    Temporary button for removing styling
  */
  const html = $('.mw-parser-output').first().html()
  const title = mw.config.get('wgPageName').replace(/_/g, ' ') // TODO? Find better way of coordinating title used here and in {{start}}
  window.showRaw = () => {
    $('.mw-parser-output').html(html)
  }
  Source_editor()
  const namespaceNumber = mw.config.get('wgNamespaceNumber')
  const shouldRender = [0, 2, 4, 12, 3002, 3004].includes(namespaceNumber)
  if (window.initialized) return; //Temp
  if (!shouldRender) return;

  if ($('.mw-parser-output').length && $('.ylhyra-text').length === 0) {
    var t0 = now()
    const { parsed, tokenized, data, flattenedData } = Parse({ html, title })
    var t1 = now()

    if (tokenized && tokenized[title]) {
      store.dispatch({
        type: 'TOKENIZED',
        currentDocument: tokenized[title],
        // allDocuments: tokenized,
        data: flattenedData,
        currentDocumentData: data[title],
      })
    } else {
      console.log('Stopped tokenization, there is no {{start}} for the current document')
    }

    Render(parsed)
    // const serverside = ReactDOMServer.renderToStaticMarkup(Render(parsed, true)) //Test for server-side-rendering
    var t2 = now()
    console.log(`Parsing took ${Math.round(t1 - t0)} ms, rendering ${Math.round(t2 - t1)} ms`)
    $('body').hasClass('mw-editable') && Editor(parsed)

  } else if ($('.ylhyra-text').length) {
    if (!window.ylhyra_data) return;
    const { parsed, tokenized, data, flattenedData } = window.ylhyra_data
    if (tokenized && tokenized[title]) {
      store.dispatch({
        type: 'TOKENIZED',
        currentDocument: tokenized[title],
        // allDocuments: tokenized,
        data: flattenedData,
        currentDocumentData: data[title],
      })
    }
    Render(parsed, true)
    $('body').hasClass('mw-editable') && Editor(parsed)
  }

  window.initialized = true
  setTimeout(() => {
    fix_inline_translations()
  }, 200)
})
