import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'
import Noun from './Noun'
import { Word } from './object'

class Inflection extends React.Component {
  constructor(props) {
    super(props);
    const parameters = ParseHTMLtoObject(props.children)
    const id = parameters.id || props.id
    this.state = {}
    this.load(id)
  }
  load = async (id) => {
    const data = (await axios.get(`${url}/api/inflection/${id}`, {})).data
    this.setState({
      rows: data,
    })
  }
  render() {
    if (!this.state.rows) return null;
    let word = new Word(this.state.rows)
    let tables
    if (word.is('noun')) {
      tables = Noun(word)
    }
    return (
      <div className="inflection">
        {word.getType('gender')} {word.getType('class')}
        {tables}
        <div className="license">
          <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`}>On BÍN</a>
        </div>
      </div>
    )
  }
}
export default Inflection
