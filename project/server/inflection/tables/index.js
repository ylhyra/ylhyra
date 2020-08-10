import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Word from 'server/inflection/tables/WordObject'
import link from 'server/inflection/tables/link'

export default (rows) => {
  const word = (new Word()).importTree(rows)
  return ReactDOMServer.renderToStaticMarkup(
    <div className="inflection">
      <h4>{(word.getBaseWord())}</h4>
      <div>{link(word.getType('class'))}</div>
      {word.getTable()}
      <div className="license">
        <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`} target="_blank">See the full table on BÍN</a> <a href="/Project:Inflections" className="info" target="_blank">About</a>
      </div>
    </div>
  )
}
