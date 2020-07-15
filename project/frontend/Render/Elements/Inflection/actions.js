import React from 'react'
import ReactDOM from 'react-dom'
import Inflection from 'frontend/Render/Elements/Inflection'

export const ShowInflectionTable = (input) => {
  input = JSON.parse(input)
  // console.log(input)
  const { BIN_id, grammatical_tag } = input
  ReactDOM.render(
    <Inflection id={BIN_id} grammatical_tag={grammatical_tag}/>,
    document.querySelector('#haha')
  )
}
