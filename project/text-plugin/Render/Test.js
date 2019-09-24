import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'

class Element extends React.Component {
  render() {
    return (
      <div className="card">
        Næs :)
      </div>
    )
  }
}
export default Element
