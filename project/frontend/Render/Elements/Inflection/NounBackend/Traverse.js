import React from 'react';
import CreateTable from './Table'

const Traverse = (input) => {
  let returns = []
  if (!Array.isArray(input))  {
    input.content.forEach((child, index) => {
      if (child.type === 'table')  {
        returns.push(
          CreateTable(child, index)
        )
      } else {
        returns.push((
          <h3 key={index}>{child.title}</h3>
        ))
        returns.push(Traverse(child))
      }
    })
  } else {
    input.forEach((child, index) => {
      returns.push((
        <h3 key={index}>{child.title}</h3>
      ))
      returns.push(Traverse(child))
    })
  }
  return returns
}
export default Traverse
