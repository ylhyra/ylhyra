import { RootState } from "app/app/store";
import React, { Component } from "react";
import { connect } from "react-redux";

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

export default connect((state: RootState) => ({
  user: state.user,
}))(User);
