import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { updateURL } from "app/Router/actions";

class SignupSteps extends React.Component {
  componentDidMount() {
    if (!this.props.user) {
      // updateURL("SIGN_UP");
    }
  }
  render() {
    return <div></div>;
  }
}
export default connect((state) => ({
  user: state.user,
  route: state.route,
}))(SignupSteps);
