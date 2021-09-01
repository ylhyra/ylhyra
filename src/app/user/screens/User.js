import React, { Component } from "react";
import { connect } from "react-redux";

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
