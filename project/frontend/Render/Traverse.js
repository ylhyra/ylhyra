import React from 'react'
import convert from 'react-attr-converter';
import inlineStyle2Json from 'App/functions/inline-style-2-json'
import Conversation from 'Render/Elements/Conversation'
import Vocabulary from 'Render/Elements/Vocabulary'
import GameContainer from 'Render/Elements/Vocabulary/GameContainer'
import Audio from 'Render/Audio'
import { html2json, json2html } from 'frontend/App/functions/html2json'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()
import isBooleanAttribute from 'is-boolean-attribute'
import Inflection from 'frontend/Render/Elements/Inflection'
import Hide from 'frontend/Render/Elements/Hide'

const Traverse = (input, index = 0, parentTag) => {
  if (!input) return null
  if (typeof input === 'string') {
    if (CannotIncludeWhitespaceChildren.includes(parentTag)) {
      return null
    }
    return input
  } else if (Array.isArray(input)) {
    return input.map((e, i) => Traverse(e, i))
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
        case 'video':
          Tag = Audio;
          break;
        case 'game-container':
          Tag = GameContainer;
          break;
        case 'inflection':
          Tag = Inflection;
          break;
        case 'collapse':
          Tag = Hide;
          break;
      }
      // if(input.props['data-type'] === 'collapse'){
      //   return <Tag key={index}>{input.props.children}</Tag>
      // }
      // else
      if (input.props.children) {
        const { children, ...props } = input.props
        return <Tag {...props} key={index}>
          {children.map((e,i) => Traverse(e,i,input.type))}
        </Tag>
      } else {
        return <Tag {...input.props} key={index}/>
      }
    } else if (input.props.children && Array.isArray(input.props.children)) {
      return {
        ...input,
        props: {
          ...input.props,
          children: input.props.children.map((e, i) => Traverse(e, i, input.type))
        }
      }
    } else if (input.props.children && typeof input.props.children === 'object') {
      return {
        ...input,
        props: {
          ...input.props,
          children: Traverse(input.props.children)
        }
      }
    }
    /*
      If it is an input, create an uncontrolled React input rather than a controlled React input
    */
    else if (input.type === 'input' && (input.props.type === 'text' || input.props.type === 'email' || input.props.type === 'password')) {
      let { value, ...props } = input.props
      return {
        ...input,
        props: {
          ...props,
          defaultValue: value,
        }
      }
    } else {
      // console.log(input)
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
