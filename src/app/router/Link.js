import { minutes, now } from "app/app/functions/time";
import { log } from "app/app/functions/log";
import { getFrontpageURL } from "app/router/actions";
import { preload } from "app/router/actions/load";
import { updateURL } from "app/router/actions/updateURL";
import React from "react";
import { connect } from "react-redux";

const start = now();

class Link extends React.Component {
  fn = (e, url) => {
    /* Do a full refresh if window is more than 10 minutes old */
    if (now() - start > 10 * minutes) {
      return;
    }
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    updateURL(url);
  };
  render() {
    let { route, href, children, className, id, to } = this.props;
    href = href || to;
    if (!href) {
      console.warn("Missing href:");
      log(children);
      return "";
    }
    if (href.startsWith("//")) {
      console.warn(`Did you mean to do ${href}?`);
    }
    // if (href.startsWith("/")) {
    //   href = URL_title(href);
    // }
    if (
      !href.startsWith("/") &&
      !/^[a-z]+:/.test(href) &&
      !href.startsWith("#")
    ) {
      href = "/" + href;
    }
    if (href === "/") {
      href = getFrontpageURL();
    }

    if ((route.pathname === href && !href.includes("#")) || !href) {
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
