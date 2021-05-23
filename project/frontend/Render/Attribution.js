/*
  Adds attribution notices to the footer of the site
*/

export default () => {
  $('#catlinks').before('<div id="license" class="license"></div>')

  /* CC0 */
  if(mw.config.get('wgCategories').includes('CC0')) {
    $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0</a></div>')
  }
  /* CC BY */
  if(mw.config.get('wgCategories').includes('CC BY')) {
    $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/licenses/by/4.0/legalcode" class="license-link" rel="noopener">CC BY</a></div>')
  }
  /* CC BY-SA */
  if(mw.config.get('wgCategories').includes('CC BY-SA')) {
    $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" class="license-link" rel="noopener">CC BY-SA</a></div>')
  }
}


/*
  Attribution for audio
*/
let done = []
export const soundAttribution = ({ filename }) => {
  /* Attribution for ISLEX audio recordings */
  if(filename && filename.match(/islex/) && !done.includes('islex')) {
    $('#license').append('<div>Short audio recordings from the <a rel="noopener" href="http://malfong.is/?pg=islexrecordings&amp;lang=en">ISLEX project</a>. <a rel="noopener" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" class="license-link">CC BY-NC-ND</a>')
    done.push('islex')
  }
}
