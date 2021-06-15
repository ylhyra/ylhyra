import GameContainer from 'app/Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'app/App/store'
import { MINUTES } from 'app/Vocabulary/actions/session'
import Link from 'app/Router/Link'

export default () => (
  <div id="vocabulary">
    <div>
      {/* TODO: Exit ætti að ná í fyrri síðu geymda í URLi */}
      <Link href="VOCABULARY">Exit</Link>{' • '}
      <Link href="/vocabulary/tutorial">Tutorial</Link>
    </div>
    <GameContainer/>
  </div>
)
