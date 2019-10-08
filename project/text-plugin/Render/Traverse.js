import React from 'react'
import convert from 'react-attr-converter';
import inlineStyle2Json from 'App/functions/inline-style-2-json'
import Conversation from 'Render/Elements/Conversation'
import Vocabulary from 'Render/Elements/Vocabulary'
import Audio from 'Render/Audio'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()

const Traverse = (input, index = 0, editor, parentTag) => {
  if (!input) return null
  const { node, tag, attr, child, text } = input
  if (node === 'element' || node === 'root') {
    let Tag = tag || 'span'
    if (tag === 'root') {
      return child.map((e, i) => Traverse(e, i))
    }
    switch (attr && attr['data-type']) {
      case 'conversation':
        Tag = Conversation;
        break;
      case 'vocabulary':
        Tag = Vocabulary;
        break;
      case 'audio':
        Tag = Audio;
        break;
    }

    // if (tag === 'word') {
    //   Tag = Word;
    // } else if (tag === 'sentence') {
    //   Tag = Sentence;
    // }

    /*
      Attribute values can be arrays (from html2json).
      Here we merge them together with spaces
    */
    let attrs = {}
    for (const property in attr) {
      // console.log(JSON.stringify({property,value:entities.decode(attr[property])}))
      // Converts HTML attribute into React attribute
      if (attr.hasOwnProperty(property) && !property.startsWith('data-temp')) {
        const value = entities.decode(entities.decode(attr[property])) // TODO! WHAT??
        // console.log(attr[property])
        // console.log(value)
        if (property === 'style') {
          attrs[convert(property)] = inlineStyle2Json(value)
        } else {
          attrs[convert(property)] = value
        }
      }
      // if(property === 'value') {
      //   attrs['value'] = undefined
      //   // attrs['defaultValue'] = attr[property]
      // }
    }

    /*
      Convert custom elements to 'span' or 'div'
      and add their name as a className
    */
    if (typeof Tag === 'string') {
      getCustomTag(Tag, attrs.className, (output) => {
        Tag = output.tag
        attrs.className = output.className
      })
    }

    // let Audio
    // if (attrs['audio-id']) {
    //   Audio = AudioPlayer(attrs['audio-id'], attrs['inline-audio-player'], editor)
    // }

    /* IMG and HR tags are void tags */
    if (voidElementTags.includes(Tag)) {
      return <Tag {...attrs} key={(attr && attr.id) || index}/>
    }

    // if(Tag === 'form') {
    //   return <div dangerouslySetInnerHTML={{__html: json2html(input)}}/>
    // }
    // console.log(child)

    return (
      <Tag {...attrs} key={(attr && attr.id) || index}>
        {/* {Audio} */}
        {child && child.map((e,i) => Traverse(e,i,editor,tag))}
      </Tag>
    )
  } else if (node === 'text') {
    if (CannotIncludeWhitespaceChildren.includes(parentTag)) {
      return null
    }
    // return text
    return entities.decode(text)
    // console.log(text)
    // return <span dangerouslySetInnerHTML={{__html: text}}/>
  }
}

export default Traverse


/*
  Allow for specific custom elements.
*/
const customTags = {
  'center': 'div',
  'translate': 'span',
  'isl': 'span',
  'small-box': 'span',
  'word': 'span',
  'sentence': 'span',
  'p': 'div',
}
const getCustomTag = (tag, className, callback) => {
  if (tag in customTags) {
    className = ((className || '') + ' ' + tag).trim()
    tag = customTags[tag]
  }
  callback({ tag, className })
}

const voidElementTags = ['data', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
const CannotIncludeWhitespaceChildren = ['table', 'tbody', 'thead', 'tr']
