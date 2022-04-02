import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";

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

const connector = connect((state: RootState) => ({
  user: state.user,
}));
export default connector(User);
