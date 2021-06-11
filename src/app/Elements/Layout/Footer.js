import LoginButton from 'app/User/LoginButton'
import Link from 'app/Router/Link'


export default (props) => (
  <div id="footer">
    <div id="footer-info">
      <span className="footer-gray">
      <Link id="footer-logo" title="Kennitala: 480520-0170" href="/Project:About">Ylhýra</Link>
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
        <Link href="/Project:Become_a_collaborator">Collaborate</Link>
        </span>
        {/* • */}
      </span>
      {/* <span className="footer-gray">
      <a href="/Special:Search">Search</a>
      </span> */}
    </div>
  </div>
)
