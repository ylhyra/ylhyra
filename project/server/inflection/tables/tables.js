import React from 'react'
import link from 'server/inflection/tables/link'
import Word from 'server/inflection/tables/WordObject'

export default (word) => {
  return word.getTree().map(row => IterateOver(row, word))
}

const IterateOver = (row, word) => {
  let table = null
  word = (new Word()).importTree(row)
  if (word.is('noun') && ['singular', 'plural'].includes(row.tag)) {
    table = GenerateTable(row.values, {
      column_names: ['without definite article', 'with definite article'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  } else if (
    (word.is('adjective') && ['singular', 'plural'].includes(row.tag)) ||
    (word.is('past participle') && ['singular', 'plural'].includes(row.tag))
  ) {
    table = GenerateTable(row.values, {
      column_names: ['masculine', 'feminine', 'neuter'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  } else if (
    word.is('verb') && ['present tense', 'past tense'].includes(row.tag) &&
    !word.is('question form')
  ) {
    table = GenerateTable(row.values, {
      column_names: ['singular', 'plural'],
      row_names: ['1st person', '2nd person', '3rd person']
    })
  }


  return <div className="indent">
    {row.tag}
    {table ? table :
      (row.values
        ? row.values.map(i => IterateOver(i, word))
        : <table className="wikitable"><tbody><tr>{(new Word([row])).renderCell(true)}</tr></tbody></table>
      )
    }
  </div>
}

/* Expects nested array of Columns -> Rows -> Values */
const GenerateTable = (input, structure) => {
  const { column_names, row_names } = structure
  let word = (new Word()).importTree(input)
  let table = []
  row_names.forEach((row_name, row_index) => {
    /* Add column names */
    if (row_index === 0) {
      let column = []
      column.push(null)
      column_names.forEach((column_name, column_index) => {
        column.push(column_name)
      })
      table.push(column)
    }

    /* Loop over data */
    let column = []
    column_names.forEach((column_name, column_index) => {
      /* Add row names */
      if (column_index === 0) {
        column.push(row_name)
      }
      column.push(word.get(column_name, row_name))
    })
    table.push(column)
  })
  return TableHTML(table)
}

const TableHTML = (input, highlight = []) => {
  return (
    <table className="wikitable">
      <tbody>
        {input.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index2) => {
              if(cell instanceof Word) {
                const shouldHighlight = true //highlight.length > 0 && cell.is(...highlight)
                return cell.renderCell(shouldHighlight)
              } else {
                return <th colSpan={3}>{cell}</th>
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
