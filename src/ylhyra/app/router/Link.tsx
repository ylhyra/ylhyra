import { RootState } from "ylhyra/app/app/store";
import { log } from "ylhyra/app/app/functions/log";
import { getTime, minutes } from "ylhyra/app/app/functions/time";
import { preload } from "ylhyra/app/router/actions/load";
import { updateURL } from "ylhyra/app/router/actions/updateURL";
import React, { FunctionComponent } from "react";
import { connect, ConnectedProps } from "react-redux";

const start = getTime();

class Link extends React.Component<
  ConnectedProps<typeof connector> & {
    href: string;
    id?: string;
    className?: string;
    children: FunctionComponent | string;
  }
> {
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

const connector = connect((state: RootState) => ({
  route: state.route,
}));
export default connector(Link);
