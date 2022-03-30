import { updateURL } from "app/router/actions/updateURL";
import { logout } from "app/user/actions";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "app/app/store";

class Form2 extends React.Component<ConnectedProps<typeof connector>> {
  componentDidMount() {
    if (!this.props.user) {
      setTimeout(() => {
        updateURL("/");
      }, 100);
    }
  }
  render() {
    return (
      <div className="centered-button">
        <button className="big" onClick={logout}>
          Log out
        </button>
      </div>
    );
  }
}
const connector = connect((state: RootState) => ({
  user: state.user,
}));
export default connector(Form2);
