

import React from 'react';
import styled from 'styled-components';

const Span = styled.span`
  &:not(:first-of-type) {
    color: #a3a3a3;
    padding-left: 4px;
    font-size: 12px;
    &:before {
      content: '/ '
    }
  }
`
const CreateCell = (cell, key) => {
  return (
    <td key={key}>
      <label>
        {/* <input type="checkbox"/> */}
        {cell.content.myndir.map((mynd, index) => (
          <Span key={index}>{mynd}</Span>
        ))}
      </label>
    </td>
  )
}
export default CreateCell
