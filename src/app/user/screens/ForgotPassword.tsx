import React from "react";
import Link from "app/router/Link";
import Login from "app/user/LoginForm";

export default () => (
  <Login
    type="login"
    above={
      <div>
        <Link href="/signup">Sign up</Link>
        <h2>Log in</h2>
      </div>
    }
  />
);
