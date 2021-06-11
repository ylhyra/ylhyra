import GameContainer from 'app/Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'app/App/store'
import { MINUTES } from 'app/Vocabulary/actions/session'
import Link from 'app/Router/Link'

export default () => (
  <div>
    <Link href="/vocabulary">Exit</Link>
    <div>Done for today!</div>
    <div><button onClick={()=>store.getState().vocabulary.deck.continueStudying()}>Continue studying</button></div>
  </div>
)
