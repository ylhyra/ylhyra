import store from 'User/App/store'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import messages from './messages'

const Notification = (props) => {
  if (!props.error) return null;
  let message = props.error.message
  if (message in messages) {
    message = messages[message]
  }
  return <div className="notification">
    {message}
  </div>
}

export default connect(state => ({
  error: state.error,
}))(Notification)

export const notify = (message) => {
  store.dispatch({
    type: 'ERROR',
    content: {
      message: message,
    }
  })
}
