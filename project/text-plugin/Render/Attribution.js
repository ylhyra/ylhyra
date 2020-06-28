/*
  Adds attribution notices to the footer of the site
*/

export default () => {
  /* CC0 */
  if(mw.config.get('wgCategories').includes('CC0')) {
    $('#footer-info').append(' • The text of this page may be freely republished under <a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode">CC0</a>.')
  }
}



/*
  Attribution for audio
*/
let done = []
export const soundAttribution = ({ filename }) => {
  /* Attribution for ISLEX audio recordings */
  if(filename && filename.match(/islex/) && !done.includes('islex')) {
    $('#footer-info').append(' • Short audio recordings from the <a rel="noopener" class="external text" href="http://malfong.is/?pg=islexrecordings&amp;lang=en">ISLEX project</a> (<a rel="noopener" class="external text" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC-BY-NC-ND</a>)')
    done.push('islex')
  }
}
