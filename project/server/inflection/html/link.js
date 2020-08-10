import React from 'react'
/*
  Creates a link from our labels to relevant Ylhýra pages
*/
export default (link, label) => {
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return null;
  }
  const url = '/' + mw.util.wikiUrlencode(link)
  return <a className="plainlink" target="_blank" href={url}>{label}</a>
}
