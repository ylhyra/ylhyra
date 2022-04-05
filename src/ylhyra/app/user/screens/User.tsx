import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";

class User extends Component<ConnectedProps<typeof connector>> {
  render() {
    const { user } = this.props;
    if (!user) return <div>LOG IN</div>;
    return (
      <div>
        Logged in as <b>{user.username}</b>
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  user: state.user,
}));
export default connector(User);
