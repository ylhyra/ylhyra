import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'

export default () => (
  <div>
    This is a very simple flashcard-based game.

    <div>
      <Link to={urls.VOCABULARY}>Got it</Link>
    </div>
  </div>
)
