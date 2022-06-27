import { Layout } from "flashcards/app/layout/layout";
import { Routes } from "flashcards/app/routes";
import "flashcards/app/styles/output.css";
import "flashcards/flashcards/styles/index.styl";

import { configure as mobxConfigure } from "mobx";
import React from "react";
import ReactDOM from "react-dom";

mobxConfigure({
  // enforceActions: "never",
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <Routes />
    </Layout>
  </React.StrictMode>,
  document.getElementById("root")
);
