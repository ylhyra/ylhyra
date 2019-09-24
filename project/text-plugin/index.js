// /*
//   PUNKTUR - Plugin for reading annotated texts
// */
//
// import Render from 'text-plugin/Render'
//
// // require('Text/InlineTranslations/AssistOnOff')
// require('Text/Touch/')
// require('Style/index.styl')
import { fix_inline_translations } from 'Render/Text/InlineTranslations/InlineTranslations/'
// // import { initAudio } from 'Audio/AudioPlayer'
// // import { initConversation } from 'Conversation/initialize'
// // import { initVocabulary } from 'Vocabulary/initialize'
//
//
//
//
// /*
//   Initialize
// */
// window.init = () => {
//   if (window.initialized) return; //Temp
//   const html = $('.mw-parser-output').html()
//   const parsed = Parser(html)
//   // console.log(parsed)
//   Render(parsed)
//   window.initialized = true
// }
//
// $(document).ready(() => {
//   window.init()
// })

import "core-js/stable";
import "regenerator-runtime/runtime";

require('Render/Text/Touch/')
require('Render/Style/index.styl')

export const title = mw.config.get('wgTitle')
export const namespaceNumber = mw.config.get('wgNamespaceNumber')
export const shouldRender = (title && namespaceNumber === 0)

import Editor from 'Editor'
import Parse from 'text-plugin/Parse'
import Render from 'text-plugin/Render'

$(document).ready(() => {
  if (window.initialized) return; //Temp
  if (!shouldRender) return;
  if ($('.mw-parser-output').length > 0) {
    const html = $('.mw-parser-output').first().html()
    const parsed = Parse(html)
    console.time('parsing')
    Render(parsed)
    console.timeEnd('parsing')
    window.initialized = true
    Editor()
    setTimeout(()=>{
      fix_inline_translations()
    },200)
  }
})


/*
  Temporary button for removing styling
*/
var original = $('.mw-parser-output').first().html()
window.showRaw = () => {
  $('.mw-parser-output').html(original)
}
