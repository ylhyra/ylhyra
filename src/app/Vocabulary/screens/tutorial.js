import React from 'react'
import Link from 'app/Elements/Link'
import { urls } from 'app/Routes/router'

export default () => (
  <div>
    This is a very simple flashcard-based game.

    <div>
      <Link to={urls.VOCABULARY}>Got it</Link>
    </div>
  </div>
)
