import store from "app/App/store";
import React, { Component } from "react";
import { connect } from "react-redux";
import { urls as app_urls } from "app/Router/paths";
import { URL_title } from "paths.js";
import { updateURL } from "app/Router/actions";

class Link extends React.Component {
  fn = (e, url) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    updateURL(url);
  };
  render() {
    let { route, href, children, className, id, to } = this.props;
    href = href || to;
    if (!href) {
      console.warn("Missing href:");
      console.log(children);
      return "";
    }
    if (href in app_urls) {
      href = app_urls[href].url;
    }
    if (href.startsWith("/")) {
      href = URL_title(href);
    }
    /* Todo: Hvað með section linka? */
    if ((route.pathname === href && !route.section) || !href) {
      return (
        <span {...{ className, id }}>
          <b>{children}</b>
        </span>
      );
    }
    if (href.startsWith("/")) {
      return (
        <a href={href} {...{ className, id }} onClick={(e) => this.fn(e, href)}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} {...{ className, id }}>
        {children}
      </a>
    );
  }
}
export default connect((state) => ({
  route: state.route,
}))(Link);
