import 'app/Style/index.scss'
import LoginButton from 'app/User/LoginButton'
import Link from 'app/App/Link'
import { urls } from 'app/Routes/router'
import Error from 'app/App/Error'
import Header from 'documents/Templates/Header'
import Footer from 'documents/Templates/Footer'

export default (props) => (
  <div id="container">
    <Error/>
    <Header/>
    <div id="content">{props.children}</div>
    <Footer/>
  </div>
)
