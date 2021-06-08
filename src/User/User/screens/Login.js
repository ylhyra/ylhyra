import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'

export default () => (
  <div>
    <Link to={urls.SIGN_UP}>Sign up</Link>

  </div>
)
