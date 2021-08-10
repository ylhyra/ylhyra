import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";

const Button = (props) => {
  return (
    <div className="login-buttons">
      {props.user ? (
        <Link href="USER_PAGE" className="logged-in-as">
          Logged in as{" "}
          <b>
            {props.user.username.length > 20
              ? props.user.username.slice(0, 15) + "..."
              : props.user.username}
          </b>
        </Link>
      ) : (
        <div>
          <Link href="LOG_IN" className="login">
            Log&nbsp;in
          </Link>
          <Link href="/signup" className="signup">
            Sign&nbsp;up
          </Link>
        </div>
      )}
    </div>
  );
};

export default connect((state) => ({
  user: state.user,
}))(Button);
