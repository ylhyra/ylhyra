import React, { Component } from 'react';
export default (props) => {
  const className = [
    'emoji',
    props.gender,
    props.large && 'large',
    props.plural && 'plural',
    props.smaller && 'smaller',
    props.article && 'article',
    props.small && 'small',
    props.very_small && 'very_small',
    ...(props.value ? props.value.replace(/ /g, '_').split('-') : [])
  ].filter(Boolean).join(' ')
  // console.log(className)
  return (<span className={className}/>)
}
