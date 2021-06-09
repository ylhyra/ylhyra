import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { withRouter } from "react-router";

class Link extends React.Component {
  render() {
    const { route, to, children, history, className, id } = this.props
    // console.log(this.props)
    if (history.location.pathname === to) {
      return <span {...{className,id}}><b>{children}</b></span>
    }
    return <RouterLink to={to} {...{className,id}}>{children}</RouterLink>
  }
}
export default withRouter(Link)
