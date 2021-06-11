import LoginButton from 'app/User/LoginButton'
import Link from 'app/Router/Link'
import { urls } from 'app/Routes/router'
import Error from 'app/App/Error'
import Header from 'app/Elements/Layout/Header'
import Footer from 'app/Elements/Layout/Footer'

const fullscreen = [
  urls.VOCABULARY_RUNNING,
]

export default (props) => (
  <div id="container">
    <Error/>
    <Header/>
    <div id="content">{props.children}</div>
    <Footer/>
  </div>
)
