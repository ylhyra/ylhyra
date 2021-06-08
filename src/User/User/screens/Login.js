import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import Login from 'User/User/Login'

export default () => <Login
  type="login"
  above={<div>
    <Link to={urls.SIGN_UP}>Sign up</Link>
    <h2>Log in</h2>
  </div>}
/>
