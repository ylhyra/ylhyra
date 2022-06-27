import { BrowserHistory, createBrowserHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import { isBrowser } from "modules/isBrowser";

export const history = isBrowser
  ? (createObservableHistory(createBrowserHistory()) as any as BrowserHistory)
  : null;

export function goToUrl(url: string) {
  if (!history) return;
  history.replace(url);
}

export function NavLink({ to: url, ...props }: any) {
  return <a href={url} {...props} />;
}
export function Link({ to: url, ...props }: any) {
  return <a href={url} {...props} />;
}
