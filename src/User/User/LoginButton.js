import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'

const Button = (props) => {
  return (
    <Link to={urls.LOG_IN}>Log in</Link>
  )
}

export default connect(state => ({
  vocabulary: state.vocabulary,
}))(Button)
