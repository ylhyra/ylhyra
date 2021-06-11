import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'app/Routes/router'
import { connect, Provider } from 'react-redux'
import store from 'app/App/store'
// import { getUserFromCookie } from 'app/User/actions'
import { Initialize as InitializeVocabulary } from 'app/Vocabulary/actions/init'
import 'documents/Style/index.scss'

InitializeVocabulary()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
