import LoginButton from 'app/User/LoginButton'
import Link from 'app/App/Link'
import { urls } from 'app/Routes/router'

export default (props) => (
  <header>
  	<div>
  		<Link to={urls.MAIN} id="logo"></Link>
  		<ul>
  			<li><Link to="/Texts">Texts</Link></li>
  			<li><Link to="/Explanations">Explanations</Link></li>
  			<li><Link to="/Project:About">About</Link></li>
        <li><LoginButton/></li>
  		</ul>
  	</div>
  </header>
)
