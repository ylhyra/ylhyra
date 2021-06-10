import Link from 'app/Elements/Link'

export default (props) => {
  return (<span className="level">
    Level <Link to={props.level}>{props.level.toUpperCase()}</Link>
  </span>)
}
