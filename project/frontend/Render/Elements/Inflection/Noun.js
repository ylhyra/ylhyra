import React from 'react'
import { Word } from './object'
import link from './link'
import { without } from 'underscore'

const Noun = (word, { relevantCellValues }) => {
  if (relevantCellValues) {
    const relevantCell = word.get(...relevantCellValues)
    const relevantRowValues = without(relevantCellValues, 'nominative', 'accusative', 'dative', 'genitive')
    const relevantRow = word.get(...relevantRowValues).getCases()

    return [
      <h4>{(relevantCell.getBaseWord())}</h4>,
      <div>{link((relevantCell.getType('gender')))} {link(word.getType('class'))}</div>,
      <hr/>,
      <div>
        {link('Declension')} in {link(relevantCell.getType('plurality'))}
        {relevantCell.getType('article') === 'with definite article' &&
          <span>, {link(relevantCell.getType('article'))}</span>
        }:
      </div>,
      table(FlipColumnsAndRows([
        [
          <th>{link('Nominative', <span className="emoji nominative"/>)}</th>,
          <th>{link('Accusative', <span className="emoji accusative"/>)}</th>,
          <th>{link('Dative', <span className="emoji dative"/>)}</th>,
          <th>{link('Genitive', <span className="emoji genitive"/>)}</th>,
        ],
        [...relevantRow],
      ]), {
        highlight: relevantCellValues
      })
    ]

  } else {
    return [
      table(FlipColumnsAndRows([
        [<th colSpan="3">{link('Singular')}</th>, null, <th>{link('Nominative')}</th>, <th>{link('Accusative')}</th>, <th>{link('Dative')}</th>, <th>{link('Genitive')}</th>, ],
        [null, <th>{link('without definite article')}</th>, ...word.get('singular', 'without definite article').getCases(), ],
        [null, <th>{link('with definite article')}</th>, ...word.get('singular', 'with definite article').getCases(), ],
      ])),
      table(FlipColumnsAndRows([
        [null, null, <th>Nominative</th>, <th>Accusative</th>, <th>Dative</th>, <th>Genitive</th>, ],
        [<th colSpan="2">Plural</th>, <th>without definite article</th>, ...word.get('plural', 'without definite article').getCases(), ],
        [null, <th>without definite article</th>, ...word.get('plural', 'with definite article').getCases(), ],
      ]))
    ]
  }
}

const table = (input, { highlight }) => (
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

const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
