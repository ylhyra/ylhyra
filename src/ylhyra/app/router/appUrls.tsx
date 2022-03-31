import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import LogIn from "ylhyra/app/user/screens/Login";
import Settings from "ylhyra/app/user/screens/Settings";
import VocabularyOverview from "ylhyra/app/vocabulary/elements/OverviewScreen";
import VocabularyRunning from "ylhyra/app/vocabulary/elements/RunningScreen";
import UserLevel from "ylhyra/app/vocabulary/elements/UserLevelScreen";
import NotFound from "ylhyra/documents/templates/404";
import React from "react";

export const app_urls = {
  "/vocabulary": {
    title: "Vocabulary",
    component: VocabularyOverview,
  },
  "/vocabulary/play": {
    title: "Vocabulary",
    component: VocabularyRunning,
  },
  "/vocabulary/difficulty": {
    title: "Difficulty",
    component: UserLevel,
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
    component: React.lazy(
      () =>
        import(
          /* webpackChunkName: "vocmak" */
          "ylhyra/maker/vocabulary_maker/Elements"
        )
    ),
  };
  app_urls["/maker/record"] = {
    component: React.lazy(
      () =>
        import(
          /* webpackChunkName: "vocmak" */
          "ylhyra/maker/vocabulary_maker/record"
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
