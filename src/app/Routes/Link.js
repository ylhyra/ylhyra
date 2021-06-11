import React, { Component } from 'react';
import { connect } from 'react-redux';
import { urls } from 'app/Routes/router'
import { URL_title } from 'documents/Compile/functions'

class Link extends React.Component {
  render() {
    let { route, href, children, className, id } = this.props
    href = href || href
    if (href.startsWith('/')) {
      href = URL_title(href)
    }
    /* Todo: Hvað með section linka? */
    if (route.pathname === href || !href) {
      return <span {...{className,id}}><b>{children}</b></span>
    }
    if (href.startsWith('/')) {
      return <a href={href} {...{className,id}}>{children}</a>
    }
    return <a href={href} {...{className,id}}>{children}</a>
  }
}
export default connect(state => ({
  route: state.route,
}))(Link)
