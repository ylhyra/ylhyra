import React from 'react'
import ReactDOM from 'react-dom'
import Inflection from 'frontend/Render/Elements/Inflection'

export const ShowInflectionTable = (BIN_id) => {
  console.log(BIN_id)

    ReactDOM.render(
      <Inflection id={BIN_id}/>,
      document.querySelector('#haha')
    )
}
