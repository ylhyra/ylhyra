import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'Vocabulary/screens/router'

export default () => (
  <div>
    <Link to={urls.LOG_IN}>Log in</Link>

    <hr/>
    Are you a beginner?
    <div>
      <button>Yes, I'm a beginner</button>
      <button>No, I already speak some Icelandic</button>
    </div>
  </div>
)
