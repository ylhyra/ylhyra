import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Recorder from './Recorder'

const RenderRecorder = () => {
  console.log('haha')
  if (mw.util.getParamValue('action') !== 'edit') return;
  $('#actions').append('<div id="recorder-button-container"></div>')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <div>
          {/* <button className="editor-button" onClick={record}>
            Record
          </button> */}
          <Recorder onFinish={(filename)=>console.log(filename)}/>

        </div>
      </div>
    </Provider>,
    document.querySelector('#recorder-button-container')
  )
}


const record = () => {

}
export default RenderRecorder
