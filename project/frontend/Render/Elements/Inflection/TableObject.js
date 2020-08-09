import React from 'react'
import link from './link'
import Word from './WordObject'

export default (word) => {
  return word.getTree().map(row => IterateOver(row, word))
}

const IterateOver = (row, word) => {
  let table = null
  if (word.is('adjective') && ['singular', 'plural'].includes(row.tag)) {
    table = GenerateTable(row.values, {
      column_names: ['masculine', 'feminine', 'neuter'],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }
  return <div className="indent">
    {row.tag}
    {table ? table :
      (row.values
        ? row.values.map(i => IterateOver(i, word))
        : <b>{row.inflectional_form}</b>
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
                const shouldHighlight = cell.is(...highlight)
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
