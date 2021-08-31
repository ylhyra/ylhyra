// import "core-js/stable";
import { isBrowser } from "app/App/functions/isBrowser";
import store from "app/App/store";
import Router from "app/Router";
import { InitializeRouter } from "app/Router/actions";
import { InitializeUser } from "app/User/actions";
import { InitializeVocabulary } from "app/Vocabulary/actions/init";
import { TextEventListenersOn } from "documents/Read/Touch";
import "documents/Style/index.scss";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "regenerator-runtime/runtime";

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

/* Frontend testing */
window.testing = async (only_run) => {
  (
    await import(
      /* webpackChunkName: "test" */
      "./test/index.js"
    )
  ).default(only_run);
};
if (process.env.NODE_ENV === "development") {
  import(
    /* webpackChunkName: "test" */
    "./test/index.js"
  );
}
