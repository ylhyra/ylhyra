import React from 'react'
var ucfirst = require('ucfirst');

/*
  Creates a link from our labels to relevant Ylhýra pages
*/
export default (link, label) => {
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return null;
  }
  const url = 'https://ylhyra.is/' + encodeURIComponent(ucfirst(link.trim().replace(/( )/g, '_')))
  return <a className="plainlink" target="_blank" href={url}>{label}</a>
}
