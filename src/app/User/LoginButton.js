import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'app/App/Link'
import { urls } from 'app/Routes/router'

const Button = (props) => {
  return (
    <div>
      {props.user ?
        <Link to={urls.USER_PAGE}>{props.user.username}</Link> :
        <Link to={urls.LOG_IN}>Log in</Link>
      }
    </div>
  )
}

export default connect(state => ({
  user: state.user,
}))(Button)
