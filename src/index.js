import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'app/Router/router'
import { connect, Provider } from 'react-redux'
import store from 'app/App/store'
import { InitializeUser } from 'app/User/actions'
import { Initialize as InitializeVocabulary } from 'app/Vocabulary/actions/init'
import 'documents/Style/index.scss'
import { InitializeRouter } from 'app/Router/actions'

InitializeUser()
InitializeVocabulary()
InitializeRouter()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
