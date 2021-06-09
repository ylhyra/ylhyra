import React from 'react'
import Link from 'User/App/Link'
import { urls } from 'User/Routes/router'
import Login from 'User/User/Login'

export default () => <Login
  type="signup"
  above={<div>
    <Link to={urls.LOG_IN}>Already have an account?</Link>

    <div>
      Step 1: Create an account<br/>
      Step 2: Pay what you want
    </div>

    <h2>Create an account</h2>
    An account allows you to save your vocabulary progress and continue the game on other devices.
  </div>}
/>
