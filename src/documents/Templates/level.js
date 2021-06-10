import Link from 'app/App/Link'

export default (props) => {
  return (<span className="level">
    Level <Link to={props.level}>{props.level.toUpperCase()}</Link>
  </span>)
}
