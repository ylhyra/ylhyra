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
import Typeset from './Render/Typeset'

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
var HtmlToReactParser = require('html-to-react').Parser // TODO: Remove this dependency
import RenderRecorder from 'text-plugin/Editor/Short_audio/Inline recorder.js'
import Attribution from 'Render/Attribution'
// import ImageLayout from 'Render/ImageLayout'

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
  require('Analytics/PageViews')
}


documentReady(async () => {
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
  const shouldRender = [0, 2, 4, 12, /*3002,*/ 3004, 3006].includes(namespaceNumber)
  RenderRecorder()
  if (!shouldRender) return;

  /*
    Frontend-side parsing
  */
  if ($('.mw-parser-output').length && $('.ylhyra-text').length === 0) {
    var t0 = now()
    const { parsed, tokenized, data, flattenedData } = await Parse({ html, title })
    var t1 = now()
    // console.log(flattenedData)
    // if (tokenized && tokenized[title]) {
    store.dispatch({
      type: 'TOKENIZED',
      currentDocument: tokenized && tokenized[title],
      // allDocuments: tokenized,
      data: flattenedData,
      currentDocumentData: data && data[title],
      parsed: parsed,
    })
    // } else {
    //   console.warn('Stopped tokenization, there is no {{start}} for the current document')
    // }

    Render(parsed, {})
    // const serverside = ReactDOMServer.renderToStaticMarkup(Render(parsed, true)) //Test for server-side-rendering
    var t2 = now()
    console.log(`Parsing took ${Math.round(t1 - t0)} ms, rendering ${Math.round(t2 - t1)} ms`)
    $('body').hasClass('mw-editable') && Editor({currentDocument: tokenized && tokenized[title]})
    // console.log(flattenedData)
    $('body').addClass('initialized')
  }
  /*
    Server side rendering
  */
  else if ($('.ylhyra-text').length) {
    var t3 = now()
    if (!window.ylhyra_data) return;
    const { parsedHTML, tokenized, data, flattenedData } = window.ylhyra_data
    store.dispatch({
      type: 'TOKENIZED',
      currentDocument: tokenized && tokenized[title],
      // allDocuments: tokenized,
      data: flattenedData,
      currentDocumentData: data && data[title],
    })
    var htmlToReactParser = new HtmlToReactParser();
    Render(htmlToReactParser.parse(parsedHTML), { hydrate: true }, /* { data: flattenedData, }*/ )
    $('body').hasClass('mw-editable') && Editor({currentDocument: tokenized && tokenized[title]})
    $('body').addClass('initialized')
    var t4 = now()
    console.log(`👨‍💻 Rendered server side. Client side hydration took ${Math.round(t4 - t3)} ms`)
  }
  // ImageLayout()

  setTimeout(() => {
    // fix_inline_translations()
    Typeset()
  }, 200)

  Attribution()
})
