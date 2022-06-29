import { Layout } from "flashcards/app/layout/layout";
import { Routes } from "flashcards/app/routes";
import "flashcards/app/styles/index.styl";
import "flashcards/app/styles/tailwind/output.css";
import { configure as mobxConfigure } from "mobx";
import React from "react";
import ReactDOM from "react-dom";

mobxConfigure({
  enforceActions: "never",
});

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <Routes />
    </Layout>
  </React.StrictMode>,
  document.getElementById("root")
);
