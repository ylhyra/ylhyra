import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { ParseHTMLtoObject } from 'Render/Elements/parse'
import Noun from './Noun'

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

    let word = new Word(this.state.rows)
    if (word.is('noun')) {
      return Noun(word)
    }
    // console.log(word)
    // let word_object = {}
    // this.state.rows.forEach(row => {
    //   console.log(classify(row))
    // })
    // let table;
    // if(word_object.is('noun')) {
    //   table = Noun(word_object)
    // }
    // return (
    //   <div className="inflection">
    //     Masculine noun
    //     <table className="wikitable">
    //       <tbody>
    //         {table}
    //       </tbody>
    //     </table>
    //     <div className="license">
    //       BÍN
    //     </div>
    //   </div>
    // )
  }
}
export default Inflection



class Word {
  classification = []
  rows = []
  constructor(props) {
    console.warn(props)
    props.forEach(row => {
      let classification = row.classification || classify(row) // Previously classified or not
      this.rows.push({
        classification,
        value: row,
      })
      this.classification = classification // Temporary
    })
  }
  is = (value) => {
    return this.classification.includes(value)
  }
  get = (...values) => {
    // console.log({
    //   rows: this.rows,
    //   values,
    //   matches: this.rows.filter(row => {
    //     let match = true
    //     values.forEach(value => {
    //       if (!row.classification.includes(value)) {
    //         match = false
    //       }
    //     })
    //     return match
    //   })
    // })
    return new Word(this.rows.filter(row => {
      let match = true
      values.forEach(value => {
        if (!row.classification.includes(value)) {
          match = false
        }
      })
      return match
    }))
  }
  getCases = () => {
    return [
      this.get('nominative'),
      this.get('accusative'),
      this.get('dative'),
      this.get('genitive'),
    ]
  }
}


const classify = (input) => {
  // console.log(input)
  const { word_class, grammatical_tag } = input
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
    if (grammatical_tag?.match(new RegExp(tag[0]))) {
      classification.push(tag[1])
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

  // console.warn(classification)
  return classification
}

let tags = [
  /* Tala */
  ['ET', 'singular'],
  ['FT', 'singular'],
  /* Föll */
  ['NF', 'nominative'],
  ['ÞF', 'accusative'],
  ['ÞGF', 'dative'],
  ['EF', 'genitive'],
]
