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

import Parse from 'text-plugin/Parse'
import Render from 'text-plugin/Render'
import Editor from 'Editor'


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
  if (!window.jQuery) return setTimeout(() => checkIfjQueryIsReady(fn), 50);
  fn()
}



documentReady(() => {
  /*
    Temporary button for removing styling
  */
  var html = $('.mw-parser-output').first().html()
  const title = mw.config.get('wgPageName').replace(/_/g, ' ') // TODO! Find better way of coordinating title used here and in {{start}}
  window.showRaw = () => {
    $('.mw-parser-output').html(html)
  }

  const namespaceNumber = mw.config.get('wgNamespaceNumber')
  const shouldRender = namespaceNumber === 0 || namespaceNumber === 3004
  if (window.initialized) return; //Temp
  if (!shouldRender) return;
  if ($('.mw-parser-output').length > 0) {
    const parsed = Parse(html)
    console.time('parsing')
    Render(parsed)
    // Editor(parsed)
    console.timeEnd('parsing')
    window.initialized = true
    setTimeout(() => {
      fix_inline_translations()
    }, 200)
  }
})
