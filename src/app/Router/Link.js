import React, { Component } from 'react';
import { connect } from 'react-redux';
import { urls as app_urls } from 'app/Router/urls'
import { URL_title } from 'documents/Compile/functions'
import { updateURL } from 'app/Router/actions'

class Link extends React.Component {
  fn = (e, url) => {
    e.preventDefault();
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    updateURL(url)
  }
  render() {
    let { route, href, children, className, id } = this.props
    if (!href) {
      console.error('Missing href:')
      console.log(children)
      return '';
    }
    if (href in app_urls) {
      href = app_urls[href].url
    }
    if (href.startsWith('/')) {
      href = URL_title(href)
    }
    /* Todo: Hvað með section linka? */
    if ((route.pathname === href && !route.section) || !href) {
      return <span {...{className,id}}><b>{children}</b></span>
    }
    if (href.startsWith('/')) {
      return <a
        href={href} {...{className,id}}
        onClick={(e)=>this.fn(e,href)}
        >{children}</a>
    }
    return <a href={href} {...{className,id}}>{children}</a>
  }
}
export default connect(state => ({
  route: state.route,
}))(Link)