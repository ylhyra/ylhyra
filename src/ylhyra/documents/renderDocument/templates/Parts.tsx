import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";

/**
 * Shows up as "Previous - 1 - 2 - 3 - Next"
 */
class Parts extends Component<
  ConnectedProps<typeof connector> & {
    /** Total number of parts this article has been split up into */
    parts: number | string;
  }
> {
  render() {
    const parts =
      typeof this.props.parts === "string"
        ? parseInt(this.props.parts)
        : this.props.parts;
    const url = this.props.route.pathname;
    if (!url || url === "/") {
      console.error(`Part.js received url: ${url}`);
      return null;
    }
    const articleBaseUrl = url.replace(/\/(\d+)$/, "");
    const currentPartNumber = parseInt(url.match(/\/(\d+)$/)?.[1]) || 1;
    let array = [];
    for (let i = 1; i <= parts; i++) {
      array.push(i);
    }
    let nextPartNumber =
      currentPartNumber + 1 <= parts ? currentPartNumber + 1 : null;
    const getBaseUrl = (partNumber) =>
      `${articleBaseUrl}/${partNumber.toString()}`;
    return (
      <div>
        <div className="parts">
          <ul>
            {array.map((k, index) => (
              <li
                key={index}
                className={`numbers ${index === 0 ? "first" : ""}`}
              >
                <Link href={getBaseUrl(k)}>{k}</Link>
              </li>
            ))}
            {nextPartNumber && (
              <li className="next">
                <Link href={getBaseUrl(nextPartNumber)}>Next</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  route: state.route,
}));
export default connector(Parts);
