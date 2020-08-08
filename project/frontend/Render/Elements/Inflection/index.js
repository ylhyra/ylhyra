import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'
import Noun from './Types/Noun'
import Word from './WordObject'
import { without } from 'underscore'
import link from './link'
import { ShowInflectionTable } from './actions'

@connect(state => ({
  inflection: state.inflection,
}))
class Inflection extends React.Component {
  state = {
    small: true
  }
  componentDidMount = () => {
    /* Inflectional search engine */
    if (!this.props.inflection.rows) {
      if (mw.config.get('wgPageName') !== 'Inflection') return;
      const id = mw.util.getParamValue('id')
      id && ShowInflectionTable({ BIN_id: id })
      this.setState({
        small: false,
      })
    }
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
    // if (this.state.small) {
    //   const relevantCellValues = this.props.inflection.relevantCellValues
    //   const relevantCell = word.get(...relevantCellValues)
    //   return <div className="inflection">
    //     <h4>{(relevantCell.getBaseWord())}</h4>
    //     <div>{link((relevantCell.getType('gender')))} {link(word.getType('class'))}</div>
    //   </div>
    // }
    return (
      <div className={`${this.state.small ? 'small' : ''} inflection`}>
        {tables}
        <div className="license">
          <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`} target="_blank">See the full table on BÍN</a> <a href="/Project:Inflections" className="info" target="_blank">About</a>
        </div>
      </div>
    )
  }
}

export default Inflection
