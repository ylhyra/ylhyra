import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { withRouter } from "react-router";
import { URL_title } from 'documents/Compile/functions'

class Link extends React.Component {
  render() {
    let { route, to, children, history, className, id, href } = this.props
    to = to || href
    if (to.startsWith('/')) {
      to = URL_title(to)
    }
    // if (!to) {
    //   console.error(`Missing to on:`)
    //   console.log(children)
    // }
    /* Todo: Hvað með section linka? */
    if (history.location.pathname === to || !to) {
      return <span {...{className,id}}><b>{children}</b></span>
    }
    if (to.startsWith('/')) {
      return <RouterLink to={to} {...{className,id}}>{children}</RouterLink>
    }
    return <a href={to} {...{className,id}}>{children}</a>
  }
}
export default withRouter(Link)
