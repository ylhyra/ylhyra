import React from "react";
import ReactDOM from "react-dom";
import Router from "app/Router";
import { connect, Provider } from "react-redux";
import store from "app/App/store";
import { InitializeUser } from "app/User/actions";
import { InitializeVocabulary } from "app/Vocabulary/actions/init";
import "documents/Style/index.scss";
import { InitializeRouter } from "app/Router/actions";
import { TextEventListenersOn } from "documents/Read/Touch";
import { isBrowser } from "app/App/functions/isBrowser";
import Render from "documents/Render";

let pre_parsed;
if (isBrowser && window.ylhyra_data) {
  pre_parsed = Render({
    json: window.ylhyra_data.parsed,
  });
}

const Root = (
  <React.StrictMode>
    <Provider store={store}>
      <Router pre_parsed={pre_parsed} />
    </Provider>
  </React.StrictMode>
);

if (window.ylhyra_data) {
  ReactDOM.hydrate(Root, document.getElementById("root"));
} else {
  ReactDOM.render(Root, document.getElementById("root"));
}

// InitializeUser();
// InitializeVocabulary();
// InitializeRouter();
TextEventListenersOn();
