import { createBrowserHistory, History } from "history";
import { createObservableHistory } from "mobx-observable-history";
import { observer } from "mobx-react";
import { isBrowser } from "modules/isBrowser";
import React, { Component } from "react";

/** Will be null in a server-side context */
export const history: History = isBrowser
  ? (createObservableHistory(createBrowserHistory()) as unknown as History)
  : (null as any as History);

export function goToUrl(url: string) {
  if (!history) return;
  history.push(url);
}

export const NavLink = observer((props: any) => {
  if (history?.location.pathname === props.to) {
    return <b {...props} />;
  } else {
    return <Link {...props} />;
  }
});

export class Link extends Component<{
  to: string;
  id?: string;
  className?: string;
  children?: any;
}> {
  onClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    goToUrl(this.props.to);
  };
  render() {
    let { to, ...props } = this.props;

    return <a {...props} href={to} onClick={this.onClick} />;
  }
}
