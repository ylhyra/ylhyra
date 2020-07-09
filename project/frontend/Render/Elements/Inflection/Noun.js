import React from 'react'
import { Word } from './object'

const Noun = (word) => {
  return table([
    null, <th rowspan="2">Singular</th>,
    null, <th>Without article</th>, <th>With article</th>,
    <th>Nominative</th>, word.get('singular', 'without-article', 'nominative'), word.get('singular', 'with-article', 'nominative'),
    <th>Accusative</th>, word.get('singular', 'without-article', 'accusative'), word.get('singular', 'with-article', 'accusative'),
    <th>Dative</th>, word.get('singular', 'without-article', 'dative'), word.get('singular', 'with-article', 'dative'),
    <th>Genitive</th>, word.get('singular', 'without-article', 'genitive'), word.get('singular', 'with-article', 'genitive'),
  ])
}


const table = (input) => (
  <table className="wikitable">
    <tbody>
      {table.map(row => (
        <tr>
          {row.map(cell => {
            if(cell instanceof Word) {
              return <td>{cell.renderCell()}</td>
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
const transposeArray = (mat) => {
  let newMat = [];
  for (let j = 0; j < mat[0].length; j++) { // j are columns
    let temp = [];
    for (let i = 0; i < mat.length; i++) { // i are rows
      temp.push(mat[i][j]); // so temp will be the j(th) column in mat
    }
    newMat.push(temp); // then just push every column in newMat
  }
  return newMat;
}
