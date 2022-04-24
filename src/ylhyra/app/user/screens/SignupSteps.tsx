import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";

class SignupSteps extends React.Component<ConnectedProps<typeof connector>> {
  componentDidMount() {}
  render() {
    return null;
    // if (!process.env.REACT_APP_PWYW) return null;
    // const isSignup = this.props.route.pathname === "/signup";
    // return (
    //   <div id="signup-steps" className="pwyw-on">
    //     <div>
    //       <span className={isSignup ? "active" : ""}>
    //         {!isSignup && "✓ "}
    //         <b>Step 1</b>: Create an account
    //       </span>
    //       <span className={!isSignup ? "active" : ""}>
    //         <b>Step 2</b>: Pay what you want
    //       </span>
    //     </div>
    //   </div>
    // );
  }
}

const connector = connect((state: RootState) => ({
  user: state.user,
  route: state.route,
}));
export default connector(SignupSteps);
