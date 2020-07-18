
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'
import Noun from './Noun'
import { Word } from './object'
import { classify } from './classify'
import { without } from 'underscore'

@connect(state => ({
  inflection: state.inflection,
}))
class Inflection extends React.Component {
  render() {
    if (!this.props.inflection.rows) return null;
    let word = new Word(this.props.inflection.rows)
    let tables
    if (word.is('noun')) {
      tables = Noun(word, {
        relevantCellValues: this.props.inflection.relevantCellValues,
      })
    }
    return (
      <div className="inflection">
        {word.getType('gender')} {word.getType('class')}
        {tables}
        <div className="license">
          <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`}>See full table on BÍN</a> <a href="/Project:Inflections" class="info">About</a>
        </div>
      </div>
    )
  }
}

export default Inflection
