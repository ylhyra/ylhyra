import React from "react";
import Link from "app/Router/Link";

import Login from "app/User/LoginForm";

export default () => (
  <Login
    type="login"
    above={
      <div>
        <Link href="SIGN_UP">Sign up</Link>
        <h2>Log in</h2>
      </div>
    }
  />
);
