import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { logout } from "ylhyra/app/user/actions";

class Form2 extends React.Component<ConnectedProps<typeof connector>> {
  componentDidMount() {
    if (!this.props.user) {
      setTimeout(() => {
        goToUrl("/");
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