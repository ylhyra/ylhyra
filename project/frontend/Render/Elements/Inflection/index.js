import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'
import Noun from './Noun'
import { Word } from './object'
import { classify } from './classify'
import { without } from 'underscore'
import link from './link'

@connect(state => ({
  inflection: state.inflection,
}))
class Inflection extends React.Component {
  state = {
    // small: true
  }
  render() {
    if (!this.props.inflection.rows) return null;
    let word = new Word(this.props.inflection.rows)
    let tables
    if (word.is('noun')) {
      tables = Noun(word, {
        relevantCellValues: this.props.inflection.relevantCellValues,
      })
    } else {
      return null
    }
    if (this.state.small) {
      const relevantCellValues = this.props.inflection.relevantCellValues
      const relevantCell = word.get(...relevantCellValues)
      return <div className="inflection">
        <h4>{(relevantCell.getBaseWord())}</h4>
        <div>{link((relevantCell.getType('gender')))} {link(word.getType('class'))}</div>
      </div>
    }
    return (
      <div className="inflection">
        {tables}
        <div className="license">
          <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`} target="_blank">See the full table on BÍN</a> <a href="/Project:Inflections" className="info" target="_blank">About</a>
        </div>
      </div>
    )
  }
}

export default Inflection
