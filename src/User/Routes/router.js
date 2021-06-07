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
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path={urls.VOCABULARY_SETUP}><VocabularyIntro/></Route>
          <Route path={urls.VOCABULARY_RUNNING}><VocabularyRunning/></Route>
          <Route path={urls.VOCABULARY_TUTORIAL}><VocabularyTutorial/></Route>
          <Route path={urls.VOCABULARY}><VocabularyOverview/></Route>
          <Route path={urls.LOG_IN}><LogIn/></Route>
          <Route path={urls.PAY}><Pay/></Route>
          <Route path={urls.SIGN_UP}><Signup/></Route>
          <Route path="/"><Main /></Route>
        </Switch>
      </Layout>
    </Router>
  );
}
