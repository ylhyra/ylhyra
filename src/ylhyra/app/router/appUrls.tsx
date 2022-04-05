import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import React from "react";
import LogIn from "ylhyra/app/user/screens/Login";
import Settings from "ylhyra/app/user/screens/Settings";
import VocabularyOverview from "ylhyra/vocabulary/app/elements/OverviewScreen";
import VocabularyRunning from "ylhyra/vocabulary/app/elements/RunningScreen";
import UserLevel from "ylhyra/vocabulary/app/elements/UserLevelScreen";
import NotFound from "ylhyra/documents/templates/404";

/**
 * Pages that are rendered by the app and are not content pages
 */
export const appUrls: {
  [url: string]: { title?: string; component?: Function };
} = {
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
    title: "Not found",
    component: NotFound,
  },
};

if (isDev && isBrowser) {
  appUrls["/maker"] = {
    component: React.lazy(
      () =>
        import(
          /* webpackChunkName: "vocmak" */
          "ylhyra/vocabulary/vocabularyEditor/Elements"
        )
    ),
  };
  appUrls["/maker/record"] = {
    component: React.lazy(
      () =>
        import(
          /* webpackChunkName: "vocmak" */
          "ylhyra/vocabulary/vocabularyEditor/record"
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
