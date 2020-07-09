/*

  Currently no interface.
  To load data in the console, run RenderEditor()

*/

import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
let timer
import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

class Editor extends React.PureComponent {
  componentDidMount = () => {}
  render() {

  }
}

const RenderEditor = async () => {
  if (!mw.config.get('wgUserGroups').includes('sysop')) return;
  $('#content').append('<div id="analytics-container"></div>')

  const { data } = await axios.get(`${url}/api/a`, {
    pageName: mw.config.get('wgPageName'),
  })
  console.log(data)

  ReactDOM.render(
    <div>
      {data.map(row => (
        <div>
          {row.page_name} – {row.unique_views} unique views
        </div>
      ))}
    </div>,
    document.querySelector('#analytics-container')
  )
}

// RenderEditor()

// window.RenderEditor = RenderEditor
