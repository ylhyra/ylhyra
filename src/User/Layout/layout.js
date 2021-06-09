import 'User/Style/index.scss'
import LoginButton from 'User/User/LoginButton'
import Link from 'User/App/Link'
import { urls } from 'User/Routes/router'
import Error from 'User/App/Error'

export default (props) => (
  <div>
    <div id="container">
      <Error/>
      
      <header>
      	<div>
      		<Link to={urls.MAIN} id="logo"></Link>
      		<ul>
      			<li><Link to="/Texts">Texts</Link></li>
      			<li><Link to="/Explanations">Explanations</Link></li>
      			<li><Link to="/Project:About">About</Link></li>
            <LoginButton/>
      		</ul>
      	</div>
      </header>

      <div id="content">
        {props.children}
      </div>

      <div id="footer">
        <div id="footer-info">
          <span className="footer-gray">
          <a id="footer-logo" title="Kennitala: 480520-0170" href="/Project:About">Ylhýra</a>
          </span>
          •
          <span className="anonymous-show">
      			<span className="footer-gray">
      			<a href="http://inflections.ylhyra.is/">Look up inflections</a>
      			</span>
      			•
            <span className="footer-gray">
            <a href="/cdn-cgi/l/email-protection#8bf2e7e3f2f9eacbf2e7e3f2f9eaa5e2f8">Report errors</a>
            </span>
            •
            <span className="footer-gray">
            <a href="/Project:Become_a_collaborator">Collaborate</a>
            </span>
            {/* • */}
          </span>
          {/* <span className="footer-gray">
          <a href="/Special:Search">Search</a>
          </span> */}
        </div>
      </div>
    </div>
  </div>
)
