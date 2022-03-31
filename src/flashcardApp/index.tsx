import Layout from "app/elements/layout";
import Routes from "app/routes";
import { store, StoreContext } from "app/store";
import "app/styles/output.css";
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
