import React from 'react'
import { classify } from './classify'
import link from './link'
import Word from './WordObject'

const Table = (word) => {
  return TableHTML(FlipColumnsAndRows([
    [null, <th>{link('Nominative')}</th>, <th>{link('Accusative')}</th>, <th>{link('Dative')}</th>, <th>{link('Genitive')}</th>, ],
    [<th colSpan="2">{link('Without definite article')}</th>, ...word.get('without definite article').getCases(), ],
    [<th colSpan="2">{link('With definite article')}</th>, ...word.get('with definite article').getCases(), ],
  ]))
}

const TableHTML = (input, properties) => {
  let highlight = (properties && properties.highlight) || []
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

export default Table
