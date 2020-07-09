import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'


class Inflection extends React.Component {
  constructor(props) {
    super(props);
    const parameters = ParseHTMLtoObject(props.children)
    this.state = {}
    this.load(parameters)
  }
  load = async ({ id }) => {
    const data = (await axios.get(`${url}/api/inflection/${id}`, {})).data
    this.setState({
      rows: data,
    })
    // console.log(data
  }
  render() {
    if (!this.state.rows) return null;
    let word_object = {}
    this.state.rows.forEach(row => {
      console.log(classify(row))
    })
    let table;
    if(word_object.is('noun')) {
      table = Noun(word_object)
    }
    return (
      <div className="inflection">
        Masculine noun
        <table className="wikitable">
          <tbody>
            {table}
          </tbody>
        </table>
        <div className="license">
          BÍN
        </div>
      </div>
    )
  }
}
export default Inflection


const classify = ({ word_class, grammatical_tag }) => {
  let classification = []
  if (word_class === 'kk') {
    classification.push('noun')
    classification.push('masculine')
  }
  if (word_class === 'kvk') {
    classification.push('noun')
    classification.push('feminine')
  }
  if (word_class === 'hk') {
    classification.push('noun')
    classification.push('neuter')
  }
  tags.forEach(tag => {
    if (grammatical_tag.match(new RegExp(tag))) {
      classification.push(tag)
    }
  })
  if (grammatical_tag.match(/gr/)) {
    classification.push('with-article')
  } else {
    classification.push('without-article')
  }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  classification.push(variantNumber)

  return classification
}

let tags = [
  /* Tala */
  'ET',
  'FT',
  /* Föll */
  'NF',
  'ÞF',
  'ÞGF',
  'EF',
]
