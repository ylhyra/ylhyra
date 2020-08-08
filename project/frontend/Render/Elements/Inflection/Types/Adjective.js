import React from 'react'
import Word from 'frontend/Render/Elements/Inflection/WordObject'
import Table from 'frontend/Render/Elements/Inflection/TableObject'
import link from 'frontend/Render/Elements/Inflection//link'

export default (word, { relevantCellValues }) => {
  return [
    <h4>{(word.getBaseWord())}</h4>,
    <div>{link((word.getType('gender')))} {link(word.getType('class'))}</div>,
    <hr/>,
    link('Singular'),
    word.get('singular').getTable(),
    <hr/>,
    link('Plural'),
    word.get('plural').getTable(),
  ]
}
