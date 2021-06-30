// import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Router from "app/Router";
import { connect, Provider } from "react-redux";
import store from "app/App/store";
import { InitializeUser } from "app/User/actions";
import { InitializeVocabulary } from "app/Vocabulary/actions/init";
import { InitializeRouter } from "app/Router/actions";
import { TextEventListenersOn } from "documents/Read/Touch";
import { isBrowser } from "app/App/functions/isBrowser";
import Render from "documents/Render";
import "documents/Style/index.scss";

let prerender;
if (isBrowser && window.ylhyra_data) {
  prerender = window.ylhyra_data.parsed;
  delete window.ylhyra_data;
}
InitializeRouter(prerender);
InitializeUser();
InitializeVocabulary();
TextEventListenersOn();

const Root = (
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <Router />
      </Suspense>
    </Provider>
  </React.StrictMode>
);

if (prerender /*|| window.is404*/) {
  ReactDOM.hydrate(Root, document.getElementById("root"));
} else {
  ReactDOM.render(Root, document.getElementById("root"));
}
