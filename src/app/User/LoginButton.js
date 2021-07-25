import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";

const Button = (props) => {
  return (
    <div>
      {props.user ? (
        <b>
          <Link href="USER_PAGE">{props.user.username}</Link>
        </b>
      ) : (
        <div>
          <Link href="LOG_IN">Log&nbsp;in</Link>{" "}
          <Link href="SIGN_UP">Sign&nbsp;up</Link>
        </div>
      )}
    </div>
  );
};

export default connect((state) => ({
  user: state.user,
}))(Button);
