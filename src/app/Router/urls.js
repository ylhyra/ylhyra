import React, { Suspense, lazy } from 'react'
import Layout from 'app/Elements/Layout/Layout'
import { updateUser } from 'app/User/actions'
import LoadContent from './LoadContent'
import Frontpage from 'app/Elements/Frontpage'

/* TODO: Hlaða skyldum saman */
const VocabularyOverview = lazy(() =>
  import ('app/Vocabulary/screens/overview'))
const VocabularyRunning = lazy(() =>
  import ('app/Vocabulary/screens/running'))
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

const urls = {
  MAIN: {
    url: '/',
    component: Frontpage
  },
  VOCABULARY: {
    url: '/vocabulary',
    component: VocabularyOverview
  },
  VOCABULARY_SETUP: {
    url: '/vocabulary/setup',
    component: VocabularyIntro
  },
  VOCABULARY_RUNNING: {
    url: '/vocabulary/play',
    component: VocabularyRunning
  },
  VOCABULARY_TUTORIAL: {
    url: '/vocabulary/tutorial',
    component: VocabularyTutorial
  },
  LOG_IN: {
    url: '/login',
    component: LogIn
  },
  SIGN_UP: {
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
for (const name in urls) {
  components[urls[name].url] = urls[name].component
}

export default components
