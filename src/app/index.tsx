import { isBrowser } from "app/app/functions/isBrowser";
import store from "app/app/store";
import Router from "app/router";
import { InitializeRouter } from "app/router/actions";
import { InitializeUser } from "app/user/actions";
import { InitializeVocabulary } from "app/vocabulary/actions/initialize";
import { TextEventListenersOn } from "documents/read/touch";
import "documents/style/main.styl";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

let prerender_data;
if (isBrowser && "ylhyra_data" in window) {
  prerender_data = window["ylhyra_data"];
  delete window["ylhyra_data"];
}
InitializeRouter(prerender_data);
InitializeUser();
void InitializeVocabulary();
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

if (prerender_data /*|| window.is404*/) {
  ReactDOM.hydrate(Root, document.getElementById("root"));
} else {
  ReactDOM.render(Root, document.getElementById("root"));
}

/* Frontend testing */
window["testing"] = async (only_run) => {
  await (
    await import(
      /* webpackChunkName: "test" */
      "tests/integrationTests"
    )
  ).default(only_run);
};
