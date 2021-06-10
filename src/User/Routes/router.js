import React, { Suspense, lazy } from 'react';
import {
  // BrowserRouter as Router,
  Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import { createBrowserHistory } from "history";
import Layout from 'User/Layout/layout'
import { updateUser } from 'User/User/actions'
import Content from './content'
// import VocabularyOverview from 'User/Vocabulary/screens/overview'
// import VocabularyRunning from 'User/Vocabulary/screens/running'
// import VocabularyTutorial from 'User/Vocabulary/screens/tutorial'
// import VocabularyIntro from 'User/Vocabulary/screens/setup'
// import LogIn from 'User/User/screens/Login'
// import Signup from 'User/User/screens/Signup'
// import Settings from 'User/User/screens/Settings'
// import Pay from 'User/User/screens/Pay'

import Main from './Main'

/* TODO: Hlaða skyldum saman */
const VocabularyOverview = lazy(()=>import('User/Vocabulary/screens/overview'))
const VocabularyRunning = lazy(()=>import('User/Vocabulary/screens/running'))
const VocabularyTutorial = lazy(()=>import('User/Vocabulary/screens/tutorial'))
const VocabularyIntro = lazy(()=>import('User/Vocabulary/screens/setup'))

const LogIn = lazy(()=>import('User/User/screens/Login'))
const Signup = lazy(()=>import('User/User/screens/Signup'))
const Settings = lazy(()=>import('User/User/screens/Settings'))
const Pay = lazy(()=>import('User/User/screens/Pay'))

export const history = createBrowserHistory()
// history.listen((location, action) => {
//   updateUser()
//   // /* React Router doesn't clear hash on page change */
//   // if (/#/.test(window.location.href)) {
//   //   window.location.href = window.location.href.split('#')[0]
//   // }
// })

export const urls = {
  VOCABULARY_SETUP: '/vocabulary/setup',
  VOCABULARY: '/vocabulary',
  VOCABULARY_RUNNING: '/vocabulary/running',
  VOCABULARY_TUTORIAL: '/vocabulary/tutorial',
  LOG_IN: '/login',
  SIGN_UP: '/signup',
  PAY: '/signup/pwyw',
  MAIN: '/',
  USER_PAGE: '/settings',
}

export default function App() {
  return (
    <Router history={history}>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path={urls.VOCABULARY_SETUP}><VocabularyIntro/></Route>
            <Route exact path={urls.VOCABULARY_RUNNING}><VocabularyRunning/></Route>
            <Route exact path={urls.VOCABULARY_TUTORIAL}><VocabularyTutorial/></Route>
            <Route exact path={urls.VOCABULARY}><VocabularyOverview/></Route>
            <Route exact path={urls.LOG_IN}><LogIn/></Route>
            <Route exact path={urls.PAY}><Pay/></Route>
            <Route exact path={urls.SIGN_UP}><Signup/></Route>
            <Route exact path={urls.USER_PAGE}><Settings /></Route>
            <Route exact path={urls.MAIN}><Main /></Route>
            <Route><Content key={history.location.pathname} /></Route>
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
}
