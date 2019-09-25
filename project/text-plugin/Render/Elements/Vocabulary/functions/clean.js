import React, { Component } from 'react';
export default (input) => {
  if (!input) return null
  const output = input.replace(/\(/g, '<span class="parentheses">(').replace(/\)/g, ')</span>')
  return (<span dangerouslySetInnerHTML={{__html: output}}/>)
}
