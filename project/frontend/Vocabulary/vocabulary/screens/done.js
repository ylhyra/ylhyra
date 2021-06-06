import GameContainer from 'Vocabulary/vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'App/store'
import { MINUTES } from 'Vocabulary/vocabulary/actions/session'
import { Link } from 'react-router-dom'

export default () => (
  <div>
    <Link to="/vocabulary">Exit</Link>
    <div>Done for today!</div>
    <div><button onClick={()=>store.getState().vocabulary.deck.continueStudying()}>Continue studying</button></div>
  </div>
)
