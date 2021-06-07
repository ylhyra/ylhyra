import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import Layout from 'User/Layout/layout'
import Main from './Main'
import NotFound from './404'
import VocabularyOverview from 'User/Vocabulary/screens/overview'
import VocabularyRunning from 'User/Vocabulary/screens/running'
import VocabularyTutorial from 'User/Vocabulary/screens/tutorial'
import LogIn from 'User/User/screens/Login'
import Pay from 'User/User/screens/Pay'
import Signup from 'User/User/screens/Signup'
import UserSettings from 'User/User/screens/Settings'
import VocabularyIntro from 'User/Vocabulary/screens/setup'

export const urls = {
  VOCABULARY_SETUP: '/vocabulary/setup',
  VOCABULARY: '/vocabulary',
  VOCABULARY_RUNNING: '/vocabulary/running',
  VOCABULARY_TUTORIAL: '/vocabulary/tutorial',
  LOG_IN: '/login',
  SIGN_UP: '/signup',
  PAY: '/signup/pwyw',
  MAIN: '/',
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path={urls.VOCABULARY_SETUP}><VocabularyIntro/></Route>
          <Route exact path={urls.VOCABULARY_RUNNING}><VocabularyRunning/></Route>
          <Route exact path={urls.VOCABULARY_TUTORIAL}><VocabularyTutorial/></Route>
          <Route exact path={urls.VOCABULARY}><VocabularyOverview/></Route>
          <Route exact path={urls.LOG_IN}><LogIn/></Route>
          <Route exact path={urls.PAY}><Pay/></Route>
          <Route exact path={urls.SIGN_UP}><Signup/></Route>
          <Route exact path={urls.MAIN}><Main /></Route>
          <Route><NotFound /></Route>
        </Switch>
      </Layout>
    </Router>
  );
}
