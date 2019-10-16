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
  if ($('.mw-parser-output').length > 0) {
    console.time('parsing')
    const { parsed, tokenized, data, flattenedData } = Parse({html, title})

    if (tokenized[title]) {
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
    // console.log(ReactDOMServer.renderToStaticMarkup(Render(parsed, true))) //Test for server-side-rendering

    $('body').hasClass('mw-editable') && Editor(parsed)
    console.timeEnd('parsing')
    window.initialized = true
    setTimeout(() => {
      fix_inline_translations()
    }, 200)
  }
})
