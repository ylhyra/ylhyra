import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Word from 'server/inflection/tables/word'
import link from 'server/inflection/tables/link'

export default (rows) => {
  const word = (new Word()).importTree(rows)
  return ReactDOMServer.renderToStaticMarkup(
    <div className="inflection">
      <h4>{(word.getBaseWord())}</h4>
      <div>{link(word.getType('class'))}</div>
      {word.getTable()}
      <div className="license">
        <a href={`https://bin.arnastofnun.is/beyging/${word.getId()}`} target="_blank">View on BÍN</a> • <a href="/Project:Inflections" className="info" target="_blank">About</a>
        <hr/>
        <div>Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII), or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. (<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA&nbsp;4.0</a>)</div>
      </div>
    </div>
  )
}
