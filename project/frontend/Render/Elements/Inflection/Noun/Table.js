

import React from 'react';
import CreateCell from './Cell'
import Input from 'Vocabulary/Input'
import Table from 'Vocabulary/elements/Table'

const CreateTable = (table, index) => {
  const columnCount = table.content.length
  const rowCount = table.content[0].content.length
  let key = 0
  let rows = []

  rows.push((<tr key={key}>
    <th className="checkbox"></th>
    <th className="checkbox" colSpan="4">
      <label>
        <Input name={table.content[0].content[0].content.flokkun + '_teachgender'} type="checkbox"/> Kenna kyn
      </label>
    </th>
  </tr>))

  // Create top
  let topRow = [(<th key={key++}/>)]
  let topRowCheckbox = [(<th key={key++}/>)]
  for (let currentColumn = 0; currentColumn < columnCount; currentColumn++) {
    topRow.push((
      <th key={key++}>
        {table.content[currentColumn].title}
      </th>
    ))
    const flokkun = table.content[currentColumn].content[0].content.flokkun
    topRowCheckbox.push((
      <th className="checkbox" key={key}>
        <label htmlFor={flokkun + '_teach'}>Kenna</label>
        <Input name={flokkun + '_teach'} type="checkbox" className="kenna" id={flokkun + '_teach'}/>
        <label>
          <b>Þýðing:</b>
          <Input name={flokkun + '_translation'} type="text"/>
        </label>
        <label>
          <b>Beinþýðing:</b>
          <Input name={flokkun + '_literal'} type="text"/>
        </label>
        <label>
          <b>Ath:</b>
          <Input name={flokkun + '_note'} type="text"/>
        </label>
        <label>
          <Input name={flokkun + '_teachtable'} type="checkbox"/> Kenna töflu
        </label>
      </th>
    ))
    key++
  }
  rows.push((<tr key={key++}>{topRowCheckbox}</tr>))
  rows.push((<tr key={key++}>{topRow}</tr>))

  // Create side
  for (let currentRow = 0; currentRow < rowCount; currentRow++) {
    let row = []
    row.push((
      <th key={key++}>
        {table.content[0].content[currentRow].title
        .replace('nefnifall', 'nf.')
        .replace('þolfall', 'þf.')
        .replace('þágufall', 'þgf.')
        .replace('eignarfall', 'ef.')}
      </th>
    ))
    for (let currentColumn = 0; currentColumn < columnCount; currentColumn++) {
      row.push(CreateCell(table.content[currentColumn].content[currentRow], key++))
    }
    rows.push((<tr key={key++}>{row}</tr>))
  }
  return (
    <Table key={index}>
      <thead>
        <tr>
          <th colSpan="10">
            {table.title}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  )
}
export default CreateTable
