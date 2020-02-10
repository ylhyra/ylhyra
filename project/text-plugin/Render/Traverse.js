import React from 'react'
import convert from 'react-attr-converter';
import inlineStyle2Json from 'App/functions/inline-style-2-json'
import Conversation from 'Render/Elements/Conversation'
import Vocabulary from 'Render/Elements/Vocabulary'
import GameContainer from 'Render/Elements/Vocabulary/GameContainer'
import Audio from 'Render/Audio'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()
import isBooleanAttribute from 'is-boolean-attribute'

const Traverse = (input, index = 0) => {
  if (!input) return null
  if (typeof input === 'string') {
    return input
  } else if (Array.isArray(input)) {
    return input.map(i => Traverse(i))
  } else if (input.props) {
    if (input.props['data-type']) {
      let Tag;
      switch (input.props['data-type']) {
        case 'conversation':
          Tag = Conversation;
          break;
        case 'vocabulary':
          Tag = Vocabulary;
          break;
        case 'audio':
          Tag = Audio;
          break;
        case 'game-container':
          Tag = GameContainer;
          break;
      }
      if (input.props.children) {
        const { children, ...props } = input.props
        return <Tag {...props} key={index}>
          {children.map((e,i) => Traverse(e,i))}
        </Tag>
      } else {
        return <Tag {...input.props}/>
      }
    } else if (input.props.children && Array.isArray(input.props.children)) {
      return {
        ...input,
        props: {
          ...input.props,
          children: input.props.children.map((e, i) => Traverse(e, i))
        }
      }
    } else {
      return input
    }
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
