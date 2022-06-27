import { Layout } from "flashcards/app/layout/layout";
import { Routes } from "flashcards/app/routes";
import { store, StoreContext } from "flashcards/app/store";
import "flashcards/app/styles/output.css";
import "flashcards/flashcards/styles/index.styl";

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
      <CustomRouter history={customHistory!}>
        <Layout>
          <Routes />
        </Layout>
      </CustomRouter>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
