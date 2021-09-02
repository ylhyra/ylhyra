import React from "react";
import VocabularyOverview from "app/vocabulary/screens/overview";
import VocabularyRunning from "app/vocabulary/screens/running";
import LogIn from "app/user/screens/Login";
import Settings from "app/user/screens/Settings";
import NotFound from "documents/templates/404";
import { isBrowser } from "app/app/functions/isBrowser";

export const urls = {
  VOCABULARY: {
    title: "Vocabulary",
    url: "/vocabulary",
    component: VocabularyOverview,
  },
  VOCABULARY_PLAY: {
    title: "Vocabulary",
    url: "/vocabulary/play",
    component: VocabularyRunning,
  },
  LOG_IN: {
    title: "Log in",
    url: "/login",
    component: LogIn,
  },
  // /signup: {
  //   title: "Sign up",
  //   url: "/signup",
  //   component: Signup,
  // },
  // PAY: {
  //   url: "/signup/pwyw",
  //   component: Pay,
  // },
  USER_PAGE: {
    url: "/settings",
    component: Settings,
  },
  NOT_FOUND: {
    url: "/not-found",
    component: NotFound,
  },
};

if (process.env.NODE_ENV === "development" && isBrowser) {
  urls["VOCABULARY_MAKER"] = {
    url: "/maker",
    component: React.lazy(() =>
      import(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/Form"
      )
    ),
  };
  urls["VOCABULARY_MAKER_RECORDER"] = {
    url: "/maker/record",
    component: React.lazy(() =>
      import(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/record"
      )
    ),
  };
}

const components = {};
const url_to_info_ = {};
for (const name in urls) {
  components[urls[name].url] = urls[name].component;
  url_to_info_[urls[name].url] = { ...urls[name], name };
}
export const url_to_info = url_to_info_;
export default components;
