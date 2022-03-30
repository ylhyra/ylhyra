import { updateURL } from "app/router/actions/updateURL";
import { logout } from "app/user/actions";
import React from "react";
import { connect } from "react-redux";

class Form2 extends React.Component {
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
export default connect((state: RootState) => ({
  user: state.user,
}))(Form2);
