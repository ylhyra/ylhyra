import GameContainer from 'app/Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'app/App/store'
import { MINUTES } from 'app/Vocabulary/actions/session'
import Link from 'app/Elements/Link'

export default () => (
  <div>
    <Link to="/vocabulary">Exit</Link>
    <GameContainer/>
  </div>
)
