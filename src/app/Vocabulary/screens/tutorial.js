import React from 'react'
import Link from 'app/Router/Link'
import { urls } from 'app/Routes/router'

export default () => (
  <div>
    This is a very simple flashcard-based game.

    <div>
      <Link href={urls.VOCABULARY}>Got it</Link>
    </div>
  </div>
)
