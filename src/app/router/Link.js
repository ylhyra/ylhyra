import React from "react";
import { connect } from "react-redux";
import { urls as app_urls } from "app/router/paths";
import { updateURL, getFrontpageURL } from "app/router/actions";
import { preload } from "./load/actions";

class Link extends React.Component {
  fn = (e, url) => {
    // /* Do a full refresh if window is more than 10 minutes old */
    // if (new Date().getTime() - start > 10 * 60 * 1000) {
    //   return;
    // }
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
    if (href.startsWith("//")) {
      console.warn(`Did you mean to do ${href}?`);
    }
    // if (href.startsWith("/")) {
    //   href = URL_title(href);
    // }
    if (
      !href.startsWith("/") &&
      !href.startsWith("http") &&
      !href.startsWith("mailto") &&
      !href.startsWith("#")
    ) {
      href = "/" + href;
    }
    if (href === "/") {
      href = getFrontpageURL();
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
        <a
          href={href}
          {...{ className, id }}
          onClick={(e) => this.fn(e, href)}
          onMouseEnter={() => preload(href)}
        >
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
