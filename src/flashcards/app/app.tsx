import { getTitle } from "flashcards/app/functions";
import { Layout } from "flashcards/app/layout/layout";
import { Routes } from "flashcards/app/routes";
import "flashcards/app/styles/index.styl";
import "flashcards/app/styles/tailwind/output.css";
import { initialize } from "flashcards/userData/initialize";
import { configure as mobxConfigure } from "mobx";
import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";

mobxConfigure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

createRoot(document.getElementById("root") as Element).render(
  // <React.StrictMode>
  <HelmetProvider>
    <Helmet>
      <title>{getTitle()}</title>
    </Helmet>
    <Layout>
      <Routes />
    </Layout>
  </HelmetProvider>,
  // </React.StrictMode>,
);

initialize();
