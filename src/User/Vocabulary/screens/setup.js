import React from 'react'
import Link from 'User/App/Link'
import { urls } from 'User/Routes/router'

export default () => (
  <div>
    Are you a beginner?
    <div>
      <button>Yes, I'm a beginner</button>
      <button>No, I already speak some Icelandic</button>
    </div>
    <Link to={urls.LOG_IN}>Already have an account?</Link>
  </div>
)
