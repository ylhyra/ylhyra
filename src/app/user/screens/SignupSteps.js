import { connect } from "react-redux";
import React from "react";
import Link from "app/router/Link";
import { updateURL } from "app/router/actions";

class SignupSteps extends React.Component {
  componentDidMount() {}
  render() {
    if (!process.env.REACT_APP_PWYW) return null;
    const isSignup = this.props.route.pathname === "/signup";
    return (
      <div id="signup-steps" className="pwyw-on">
        <span className={isSignup ? "active" : ""}>
          {!isSignup && "✓ "}
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