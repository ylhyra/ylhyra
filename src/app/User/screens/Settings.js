import React from "react";
import { logout } from "app/User/actions";
import { updateURL } from "app/Router/actions";
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
export default connect((state) => ({
  user: state.user,
}))(Form2);
