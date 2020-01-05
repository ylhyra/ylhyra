import store from 'App/store'
import { getText } from 'project/text-plugin/Parse/ExtractText/ExtractText'
import { getTextFromTokenized } from 'project/text-plugin/Parse/WrapInTags/1-InsertSplit.js'
import hash from 'project/text-plugin/App/functions/hash'
import NotifyError from 'App/Error'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

/*
  Allows just a single audio file
*/
export default () => {
  const { parsed, tokenized } = store.getState().editor
  // console.log(parsed)
  let done;
  // console.log(json2html(parsed))
  findAreasWithAudioFile(parsed, (node, filename) => {
    if (done) {
      NotifyError('Only one audio area can be used at a time, for multiple uses you must transclude them.')
    } else {
      done = true
      const XML = AudioXML(node)
      // console.log(done)
      // console.log(XML)
      console.log(ReactDOMServer.renderToStaticMarkup(XML))
      if (XML) {
        store.dispatch({
          type: 'AUDIO_AREA',
          filename,
          content: ReactDOMServer.renderToStaticMarkup(XML),
        })
      }
    }
  })
}

const findAreasWithAudioFile = (i, callback) => {
  if (!i) return;
  if (Array.isArray(i)) {
    return i.map(x => findAreasWithAudioFile(x, callback))
  } else {
    let { node, tag, attr, child, text } = i
    if (child) {
      if (attr && attr['data-audio-file']) {
        // console.warn('------')
        // console.warn(child)
        callback(child, attr['data-audio-file'])
      } else {
        child.forEach(x => findAreasWithAudioFile(x, callback))
      }
    }
  }
}

/*
  Prepare an XML file for audio synchronization.
  Only leaves id tags on sentences and words.
*/
const AudioXML = (input, index = 0) => {
  //   console.log((input))
  // return

  if (!input) return null
  if (Array.isArray(input)) {
    return input.map(x => AudioXML(x))
  } else {
    const { node, tag, attr, child, text } = input
    console.log(input)
    if (node === 'element' || node === 'root') {
      if (attr && ('data-no-audio' in attr || 'data-type' in attr || 'data-children' in attr || 'data-not-text' in attr)) return null;
      if (includesAny(skipTags, tag)) return null;
      if (tag === 'sup') return null;
      // if (attr && includesAny(skipClasses, attr.class)) return null;

      let attrs = {}
      let Tag = tag || 'span'
      if (attr && (attr['data-type'] ==='sentence' || attr['data-type'] ==='word') ){
        // console.log(input)
        Tag = 'span'
        attrs = {
          id: (attr && attr.id),
        }
      }
      if (tag === 'root') {
        return child.map((e, i) => AudioXML(e, i))
      }
      if (!child || child.length === 0) return null;
      // console.log(attrs)
      if (attrs.id) {
        return (
          <Tag {...attrs} key={index}>
            {child && child.map((e,i) => AudioXML(e,i))}
          </Tag>
        )
      } else {
        return child && child.map((e, i) => AudioXML(e, i))
      }
    } else if (node === 'text') {
      return text
    }
  }
}

// const skipClasses = [
//   'data-sou',
// ]
const skipTags = [
  'data-no-audio',
  'data-ignore',
]

export const includesAny = (haystack, arr) => {
  if (!arr) return false;
  if (typeof arr === 'string') {
    arr = [arr]
  }
  return arr.some((v) => {
    return haystack.indexOf(v) >= 0;
  })
}
