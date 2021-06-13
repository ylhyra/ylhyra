import Link from 'app/Router/Link'

export default (props) => {
  return (
    <div className={`ylhyra_image right ${props.position||''}`}>
      {props.children}
    </div>
  )
}
