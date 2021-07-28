import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { updateURL } from "app/Router/actions";

class SignupSteps extends React.Component {
  componentDidMount() {}
  render() {
    const isSignup = this.props.route.pathname === "/signup";
    return (
      <div id="signup-steps">
        <span className={isSignup ? "active" : ""}>
          <b>Step 1</b>: Create an account
        </span>
        <span className={!isSignup ? "active" : ""}>
          <b>Step 2</b>: Pay what you want
        </span>
      </div>
    );
  }
}
export default connect((state) => ({
  user: state.user,
  route: state.route,
}))(SignupSteps);
