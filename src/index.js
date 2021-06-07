import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'User/Routes/router'
import { connect, Provider } from 'react-redux'
import store from 'User/App/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
