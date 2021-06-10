import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { withRouter } from "react-router";
import { URL_title } from 'documents/Compile/functions'

class Link extends React.Component {
  render() {
    let { route, to, children, history, className, id, href } = this.props
    to = URL_title(to || href)
    if (history.location.pathname === to) {
      return <span {...{className,id}}><b>{children}</b></span>
    }
    return <RouterLink to={to} {...{className,id}}>{children}</RouterLink>
  }
}
export default withRouter(Link)
