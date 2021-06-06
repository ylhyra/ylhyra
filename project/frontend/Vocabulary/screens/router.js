import React from 'react'
import {
  HashRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import Main from './Main'
import VocabularyOverview from 'Vocabulary/vocabulary/screens/overview'
import VocabularyRunning from 'Vocabulary/vocabulary/screens/running'
import LogIn from 'Vocabulary/user/screens/Login'
import Pay from 'Vocabulary/user/screens/Pay'
import Signup from 'Vocabulary/user/screens/Signup'
import UserSettings from 'Vocabulary/user/screens/Settings'

export const urls = {
  VOCABULARY: '/vocabulary',
  VOCABULARY_RUNNING: '/vocabulary/running',
  LOG_IN: '/login',
  SIGN_UP: '/signup',
  PAY: '/pay',
}

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path={urls.VOCABULARY}><VocabularyOverview/></Route>
        <Route path={urls.VOCABULARY_RUNNING}><running/></Route>
        <Route path={urls.LOG_IN}><LogIn/></Route>
        <Route path={urls.SIGN_UP}><Signup/></Route>
        <Route path={urls.PAY}><Pay/></Route>
        <Route path="/"><Main /></Route>
      </Switch>
    </HashRouter>
  );
}
