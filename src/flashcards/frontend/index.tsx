import Layout from "flashcards/elements/layout";
import Routes from "flashcards/frontend/routes";
import { store, StoreContext } from "flashcards/frontend/store";
import "flashcards/frontend/styles/output.css";
import { configure as mobxConfigure } from "mobx";
import { customHistory, CustomRouter } from "modules/router";
import React from "react";
import ReactDOM from "react-dom";

mobxConfigure({
  enforceActions: "never",
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <CustomRouter history={customHistory}>
        <Layout>
          <Routes />
        </Layout>
      </CustomRouter>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
