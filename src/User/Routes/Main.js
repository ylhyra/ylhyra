import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'

export default () => (
  <div>
    Are you a beginner?
    <div>
      <Link to={urls.VOCABULARY_SETUP} className="button">Start learning</Link>
    </div>
    <Link to={urls.LOG_IN}>Already have an account?</Link>
  </div>
)
