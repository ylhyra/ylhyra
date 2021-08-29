import React, { Suspense, lazy } from "react";
import Layout from "app/Elements/Layout/Layout";
import { updateUser } from "app/User/actions";
import LoadContent from "./LoadContent";
import VocabularyOverview from "app/Vocabulary/screens/overview";
import VocabularyRunning from "app/Vocabulary/screens/running";
import LogIn from "app/User/screens/Login";
// import Signup from "app/User/screens/Signup";
import Settings from "app/User/screens/Settings";
import Pay from "app/User/payments/Pay";
import NotFound from "documents/Templates/404";
import { isBrowser } from "app/App/functions/isBrowser";

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

  // /vocabulary/tutorial: {
  //   title: 'Vocabulary',
  //   url: '/vocabulary/tutorial',
  //   component: VocabularyTutorial
  // },
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
        "./../../maker/VocabularyMaker"
      )
    ),
  };
  urls["VOCABULARY_MAKER_RECORDER"] = {
    url: "/maker/record",
    component: React.lazy(() =>
      import(
        /* webpackChunkName: "vocmakr" */
        "./../../maker/VocabularyMaker/record"
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
