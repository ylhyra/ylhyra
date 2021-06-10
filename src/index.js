import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'app/Routes/router'
import { connect, Provider } from 'react-redux'
import store from 'app/App/store'
import { InitializeUser } from 'app/User/actions'
import 'documents/Style/index.scss'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
