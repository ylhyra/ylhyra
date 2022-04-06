import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";

class X extends Component {
  render() {
    const parts = parseInt(this.props.parts);
    const url = this.props.route.pathname;
    if (!url || url === "/") {
      console.error(`Part.js received url: ${url}`);
      return null;
    }
    const basename = url.replace(/\/(\d+)$/, "") + "/";
    const part = parseInt(url.match(/\/(\d+)$/)?.[1]) || 1;
    let array = [];
    for (let i = 1; i <= parts; i++) {
      array.push(i);
    }
    let next = part + 1 <= parts ? part + 1 : null;
    const f = (j) => basename + j.toString();
    return (
      <div>
        {/*<div className="small gray center sans-serif">*/}
        {/*  This article has been split up into {parts} parts:*/}
        {/*</div>*/}
        <div className="parts">
          {/* <Link>1</Link> */}
          <ul>
            {array.map((k, index) => (
              <li
                key={index}
                className={`numbers ${index === 0 ? "first" : ""}`}
              >
                <Link href={f(k)}>{k}</Link>
              </li>
            ))}
            {next && (
              <li className="next">
                <Link href={f(next)}>Next</Link>
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
export default connector(X);
