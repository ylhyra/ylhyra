import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import SpeedReader from 'Render/Elements/Speed_reading'
import { open } from './actions/actions'

export const SpeedReaderSetup = () => {
  /* Book not found */
  if ($('.book').length === 0 && mw.config.get('wgPageName') === 'Ylhýra' || mw.config.get('wgPageName') === 'Text:Frontpage') return;
  if ($('.book').length !== 1) return;
  $('#catlinks').before('<div id="speed-reader-button-container"></div>')
  $('#container').after('<div id="speed-reader-container"></div>')

  ReactDOM.render(
    <button className="small" onClick={open}>Speed read</button>,
    document.getElementById('speed-reader-button-container')
  )
  ReactDOM.render(
    <Provider store={store}>
      <SpeedReaderContainer/>
    </Provider>,
    document.getElementById('speed-reader-container')
  )

}
export default SpeedReaderSetup


@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReaderContainer extends React.Component {
  render() {
    if (this.props.speed_reader.open) {
      // window.listenerCount = 0 /* Turn off mousemove listener for text popups */
      return <SpeedReader/>
    }
    return null
  }
}
// setTimeout(()=>{
//   SpeedReaderSetup() // TEMP!!
// },100)
