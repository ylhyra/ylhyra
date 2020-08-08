import React from 'react'
import Word from './WordObject'
import Table from './TableObject'
import link from './link'
import { without } from 'underscore'

const Noun = (word, { relevantCellValues }) => {
  if (relevantCellValues) {
    // const relevantCell = word.get(...relevantCellValues)
    // const relevantRowValues = without(relevantCellValues, 'nominative', 'accusative', 'dative', 'genitive')
    // const relevantRow = word.get(...relevantRowValues).getCases()
    //
    // return [
    //   <h4>{(relevantCell.getBaseWord())}</h4>,
    //   <div>{link((relevantCell.getType('gender')))} {link(word.getType('class'))}</div>,
    //   <hr/>,
    //   <div>
    //     {link('Declension')} in {link(relevantCell.getType('plurality'))}
    //     {relevantCell.getType('article') === 'with definite article' &&
    //       <span>, {link(relevantCell.getType('article'))}</span>
    //     }:
    //   </div>,
    //   table(FlipColumnsAndRows([
    //     [
    //       <th>{link('Nominative', <span className="emoji nominative"/>)}</th>,
    //       <th>{link('Accusative', <span className="emoji accusative"/>)}</th>,
    //       <th>{link('Dative', <span className="emoji dative"/>)}</th>,
    //       <th>{link('Genitive', <span className="emoji genitive"/>)}</th>,
    //     ],
    //     [...relevantRow],
    //   ]), {
    //     highlight: relevantCellValues
    //   })
    // ]
    return null

  } else {
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
}






const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
export default Noun
