import { isBrowser } from "modules/isBrowser";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "ylhyra/app/app/store";
import Router from "ylhyra/app/router";
import { initializeRouter } from "ylhyra/app/router/actions/actions";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { initializeUser } from "ylhyra/app/user/actions";
import { initializeVocabulary } from "ylhyra/app/vocabulary/actions/initialize";
import { textEventListenersOn } from "ylhyra/documents/read/touch";
import "ylhyra/documents/style/main.styl";

let prerenderData: PrerenderedDataSavedInPage | null = null;
if (isBrowser && "ylhyra_data" in window) {
  prerenderData = window["ylhyra_data"] as PrerenderedDataSavedInPage;
  delete window["ylhyra_data"];
}
initializeRouter(prerenderData);
initializeUser();
void initializeVocabulary();
textEventListenersOn();

const Root = (
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <Router />
      </Suspense>
    </Provider>
  </React.StrictMode>
);

if (prerenderData /*|| window.is404*/) {
  ReactDOM.hydrate(Root, document.getElementById("root"));
} else {
  ReactDOM.render(Root, document.getElementById("root"));
}

/* Frontend testing */
window["testing"] = async (only_run) => {
  await (
    await import(
      /* webpackChunkName: "test" */
      "ylhyra/tests/integrationTests"
    )
  ).default(only_run);
};
