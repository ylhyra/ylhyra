import React, { Component } from "react";
import { connect } from "react-redux";
import {
  isBrowser,
  hasLocalStorage,
  supportsTouch,
} from "app/app/functions/isBrowser";

@connect((state) => ({
  user: state.user,
}))
class User extends Component {
  render() {
    const { user } = this.props;
    if (!user) return <div>LOG IN</div>;
    return (
      <div>
        Logged in as <b>{user.name}</b>
      </div>
    );
  }
}
export default User;
