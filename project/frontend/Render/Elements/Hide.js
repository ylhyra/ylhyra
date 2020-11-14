import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import { html2json, json2html } from 'frontend/App/functions/html2json'

class Hide extends React.Component {
state = {}
  render() {
    return <div className="collapse">

      <div className="button" onClick={()=>this.setState({open:!this.state.open})}>
        {this.state.open ? 'Close':'Open'}
      </div>

      {this.state.open && this.props.children}
    </div>
  }
}

export default Hide
