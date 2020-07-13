import React from 'react'
import { Word } from './object'
import link from './link'

const Noun = (word) => {
  return [
    table(FlipColumnsAndRows([
      [<th colSpan="3">{link('Singular')}</th>, null, <th>{link('Nominative')}</th>, <th>{link('Accusative')}</th>, <th>{link('Dative')}</th>, <th>{link('Genitive')}</th>,],
      [null, <th>{link('Without article')}</th>, ...word.get('singular', 'without-article').getCases(),],
      [null,                               <th>{link('With article')}</th>, ...word.get('singular', 'with-article').getCases(),],
    ])),
    table(FlipColumnsAndRows([
      [null, null, <th>Nominative</th>, <th>Accusative</th>, <th>Dative</th>, <th>Genitive</th>,],
      [<th colSpan="2">Plural</th>, <th>Without article</th>,...word.get('plural', 'without-article').getCases(),],
      [null,                               <th>Without article</th>, ...word.get('plural', 'with-article').getCases(),],
    ]))
  ]
}


const table = (input) => (
  <table className="wikitable">
    <tbody>
      {input.map((row, index) => (
        <tr key={index}>
          {row.map((cell, index2) => {
            if(cell instanceof Word) {
              return <td key={index2}>{cell.renderCell()}</td>
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

export default Noun


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
