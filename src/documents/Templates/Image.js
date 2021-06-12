import Link from 'app/Router/Link'

export default (props) => {
  return (
    <picture>
      {/* <source media="(max-width: 400px)" srcset="{{filepath:{{{1|}}}|400|nowiki}} 1x, {{filepath:{{{1|}}}|800|nowiki}} 2x"> */}
      <img src={props.src} alt=""/>
    </picture>
  )
}
