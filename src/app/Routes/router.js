import React, { Suspense, lazy } from 'react'
import Layout from 'app/Elements/Layout/Layout'
import { updateUser } from 'app/User/actions'
import LoadContent from './LoadContent'
import Frontpage from 'app/Elements/Frontpage'

/* TODO: Hlaða skyldum saman */
const VocabularyOverview = lazy(()=>import('app/Vocabulary/screens/overview'))
const VocabularyRunning = lazy(()=>import('app/Vocabulary/screens/running'))
const VocabularyTutorial = lazy(()=>import('app/Vocabulary/screens/tutorial'))
const VocabularyIntro = lazy(()=>import('app/Vocabulary/screens/setup'))

const LogIn = lazy(()=>import('app/User/screens/Login'))
const Signup = lazy(()=>import('app/User/screens/Signup'))
const Settings = lazy(()=>import('app/User/screens/Settings'))
const Pay = lazy(()=>import('app/User/screens/Pay'))



export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {/* <Route exact path={urls.VOCABULARY_SETUP}><VocabularyIntro/></Route> */}
          <Route exact path={urls.VOCABULARY_RUNNING}><VocabularyRunning/></Route>
          <Route exact path={urls.VOCABULARY_TUTORIAL}><VocabularyTutorial/></Route>
          <Route exact path={urls.VOCABULARY}><VocabularyOverview/></Route>
          <Route exact path={urls.LOG_IN}><LogIn/></Route>
          <Route exact path={urls.PAY}><Pay/></Route>
          <Route exact path={urls.SIGN_UP}><Signup/></Route>
          <Route exact path={urls.USER_PAGE}><Settings /></Route>
          <Route exact path={urls.MAIN}><Frontpage /></Route>
          <Route><LoadContent key={history.location.pathname} /></Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}
