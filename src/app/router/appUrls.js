import React from "react";
import VocabularyOverview from "app/vocabulary/elements/OverviewScreen";
import VocabularyRunning from "app/vocabulary/elements/RunningScreen";
import LogIn from "app/user/screens/Login";
import Settings from "app/user/screens/Settings";
import NotFound from "documents/templates/404";
import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";
import SelectLevel from "app/vocabulary/elements/SelectLevelScreen";

export const app_urls = {
  "/vocabulary": {
    title: "Vocabulary",
    component: VocabularyOverview,
  },
  "/vocabulary/play": {
    title: "Vocabulary",
    component: VocabularyRunning,
  },
  "/vocabulary/selectleveltemporary": {
    title: "Vocabulary",
    component: SelectLevel,
  },
  "/login": {
    title: "Log in",
    component: LogIn,
  },
  "/settings": {
    title: "Settings",
    component: Settings,
  },
  "/not-found": {
    component: NotFound,
  },
};

if (isDev && isBrowser) {
  app_urls["/maker"] = {
    component: React.lazy(() =>
      import(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/Elements"
      )
    ),
  };
  app_urls["/maker/record"] = {
    component: React.lazy(() =>
      import(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/record"
      )
    ),
  };
}

// const components = {};
// const url_to_info_ = {};
// for (const name of Object.keys(urls)) {
//   components[urls[name].url] = urls[name].component;
//   url_to_info_[urls[name].url] = { ...urls[name], name };
// }
// export const url_to_info = url_to_info_;
// export default components;
