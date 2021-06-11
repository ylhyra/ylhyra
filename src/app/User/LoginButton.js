import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'app/Router/Link'


const Button = (props) => {
  return (
    <div>
      {props.user ?
        <Link href={'USER_PAGE'}>{props.user.username}</Link> :
        <Link href={'LOG_IN'}>Log in</Link>
      }
    </div>
  )
}

export default connect(state => ({
  user: state.user,
}))(Button)
