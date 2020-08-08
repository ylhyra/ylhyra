import React from 'react'
import Word from 'frontend/Render/Elements/Inflection/WordObject'
import Table from 'frontend/Render/Elements/Inflection/TableObject'
import link from 'frontend/Render/Elements/Inflection//link'
import { without } from 'underscore'

export default (word, { relevantCellValues }) => {
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
