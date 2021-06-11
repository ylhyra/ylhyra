import LoginButton from 'app/User/LoginButton'
import Link from 'app/Router/Link'
import { urls } from 'app/Routes/router'

export default (props) => (
  <header>
  	<div>
  		<Link href={urls.MAIN} id="logo"></Link>
  		<ul>
        <li><Link href="/Texts">Texts</Link></li>
  			<li><Link href="/Vocabulary">Vocabulary</Link></li>
  			<li><Link href="/Explanations">Explanations</Link></li>
  			<li><Link href="/Project:About">About</Link></li>
        <li><LoginButton/></li>
  		</ul>
  	</div>
  </header>
)
