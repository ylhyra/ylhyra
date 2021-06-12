import React, { Suspense, lazy } from 'react'
import Layout from 'app/Elements/Layout/Layout'
import { updateUser } from 'app/User/actions'
import LoadContent from './LoadContent'
import Frontpage from 'app/Elements/Frontpage'

/* TODO: Hlaða skyldum saman */
import VocabularyOverview from 'app/Vocabulary/screens/overview'
import VocabularyRunning from 'app/Vocabulary/screens/running'
const VocabularyTutorial = lazy(() =>
  import ('app/Vocabulary/screens/tutorial'))
const VocabularyIntro = lazy(() =>
  import ('app/Vocabulary/screens/setup'))

const LogIn = lazy(() =>
  import ('app/User/screens/Login'))
const Signup = lazy(() =>
  import ('app/User/screens/Signup'))
const Settings = lazy(() =>
  import ('app/User/screens/Settings'))
const Pay = lazy(() =>
  import ('app/User/screens/Pay'))

const list = {
  MAIN: {
    url: '/',
    component: Frontpage
  },
  VOCABULARY: {
    title: 'Vocabulary',
    url: '/vocabulary',
    component: VocabularyOverview
  },
  VOCABULARY_SETUP: {
    title: 'Vocabulary',
    url: '/vocabulary/setup',
    component: VocabularyIntro
  },
  VOCABULARY_RUNNING: {
    title: 'Vocabulary',
    url: '/vocabulary/play',
    component: VocabularyRunning
  },
  VOCABULARY_TUTORIAL: {
    title: 'Vocabulary',
    url: '/vocabulary/tutorial',
    component: VocabularyTutorial
  },
  LOG_IN: {
    title: 'Log in',
    url: '/login',
    component: LogIn
  },
  SIGN_UP: {
    title: 'Sign up',
    url: '/signup',
    component: Signup
  },
  PAY: {
    url: '/signup/pwyw',
    component: Pay
  },
  USER_PAGE: {
    url: '/settings',
    component: Settings
  },
}

const components = {}
const url_to_info_ = {}
for (const name in list) {
  components[list[name].url] = list[name].component
  url_to_info_[list[name].url] = { ...list[name], name }
}
export const urls = list
export const url_to_info = url_to_info_
export default components
