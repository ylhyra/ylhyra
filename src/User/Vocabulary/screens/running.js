import GameContainer from 'User/Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'User/App/store'
import { MINUTES } from 'User/Vocabulary/actions/session'
import Link from 'User/App/Link'

export default () => (
  <div>
    <Link to="/vocabulary">Exit</Link>
    <GameContainer/>
  </div>
)
