import React from "react";
import Link from "ylhyra/app/router/Link";
import Login from "ylhyra/app/user/LoginForm";

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
