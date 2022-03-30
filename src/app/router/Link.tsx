import { log } from "app/app/functions/log";
import { getTime, minutes } from "app/app/functions/time";
import { preload } from "app/router/actions/load";
import { updateURL } from "app/router/actions/updateURL";
import React from "react";
import { connect } from "react-redux";

const start = getTime();

class Link extends React.Component<{
  href: string;
  // id?: string;
  className?: string;
}> {
  fn = (e, url) => {
    /* Do a full refresh if window is more than 10 minutes old */
    if (getTime() - start > 10 * minutes) {
      return;
    }
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    updateURL(url);
  };
  render() {
    let { route, href, children, className, id } = this.props;
    if (!href) {
      console.warn("Missing href:");
      log(children);
      return "";
    }
    if (href.startsWith("//")) {
      console.error(`Typo in href found: "${href}" in route "${route}"`);
    }
    if (href.startsWith("https://ylhyra.is/")) {
      href = href.replace("https://ylhyra.is", "");
    }
    if (
      !href.startsWith("/") &&
      !/^[a-z]+:/.test(href) &&
      !href.startsWith("#")
    ) {
      href = "/" + href;
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
