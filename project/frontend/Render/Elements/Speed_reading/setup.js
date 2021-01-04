import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import SpeedReader from 'Render/Elements/Speed_reading'
import { open } from './actions/start'

export const SpeedReaderSetup = () => {
  /* Book not found */
  if ($('.book').length === 0 && mw.config.get('wgPageName') === 'Ylhýra' || mw.config.get('wgPageName') === 'Text:Frontpage') return;
  if ($('.book').length !== 1) return;
  $('#container').after('<div id="speed-reader-button-container"></div>')

  ReactDOM.render(
    <Provider store={store}>
      <SpeedReaderButton/>
    </Provider>,
    document.getElementById('speed-reader-button-container')
  )

}
export default SpeedReaderSetup


@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReaderButton extends React.Component {
  render() {
    if (this.props.speed_reader.open) {
      window.listenerCount = 0 /* Turn off mousemove listener for text popups */
      return <SpeedReader/>
    } else {
      window.listenerCount = 1
      return <button className="small" onClick={open}>Speed read</button>
    }
  }
}
// setTimeout(()=>{
//   SpeedReaderSetup() // TEMP!!
// },100)
