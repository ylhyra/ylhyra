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
      columns: ['masculine', 'feminine', 'neuter'],
      rows: ['nominative', 'accusative', 'dative', 'genitive']
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
  const { columns, rows } = structure
  let word = (new Word()).importTree(input)
  let table = new Table()
  //
  // console.warn(input)
  // console.log(word)
  // word.get('masculine')
  // return;

  let t = []
  columns.forEach((column, column_index) => {
    let c = []
    rows.forEach((row, row_index) => {
      // console.log(word.get(column, row))
      c.push(word.get(column, row))
    })
    t.push(c)
  })
  console.log(t)
  return TableHTML(t)

  // column_array.forEach(i => {
  //   table.addColumn({
  //     title: i.tag
  //   })
  // })
  // TableHTML(column_array)
}

class Table {
  constructor() {}
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
              } else if (cell === null) {
                return <th key={index2}/>
              } else {
                return cell
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* Chuan Sun https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript */
const FlipColumnsAndRows = (input) => {
  let newMat = [];
  for (let j = 0; j < input[0].length; j++) { // j are columns
    let temp = [];
    for (let i = 0; i < input.length; i++) { // i are rows
      temp.push(input[i][j]); // so temp will be the j(th) column in mat
    }
    newMat.push(temp); // then just push every column in newMat
  }
  return newMat;
}

// return TableHTML(FlipColumnsAndRows([
//   [null, <th>{link('Nominative')}</th>, <th>{link('Accusative')}</th>, <th>{link('Dative')}</th>, <th>{link('Genitive')}</th>, ],
//   [<th colSpan="2">{link('Without definite article')}</th>, ...word.get('without definite article').getCases(), ],
//   [<th colSpan="2">{link('With definite article')}</th>, ...word.get('with definite article').getCases(), ],
// ]))
