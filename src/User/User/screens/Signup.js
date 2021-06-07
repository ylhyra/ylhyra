import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import Login from 'User/User/Login'

export default () => (
  <div>
    <Link to={urls.LOG_IN}>Already have an account?</Link>
    <Login/>
  </div>
)
