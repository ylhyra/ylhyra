import React from 'react'
import Link from 'app/Router/Link'
import { urls } from 'app/Routes/router'
import Login from 'app/User/Login'

export default () => <Login
  type="login"
  above={<div>
    <Link href={urls.SIGN_UP}>Sign up</Link>
    <h2>Log in</h2>
  </div>}
/>
