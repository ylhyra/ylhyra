import { login } from "flashcards/user/login/actions";
import type { LoginRequest } from "flashcards/user/login/login.server";
import { observer } from "mobx-react";
import { FormHelper } from "modules/form";
import { history } from "modules/router";
import React from "react";

export const Login = observer(() => {
  const isSignup = history?.location.pathname === "/signup";

  const { Form, getChangeHandlers, setFormValues } = new FormHelper({
    onSubmit: login,
    values: {
      username: "",
      email: "",
      password: "",
      isLoginOrSignup: isSignup ? "signup" : "login",
    } as LoginRequest,
    usesExternalStore: false,
  });

  return (
    <Form>
      <label>
        Username:
        <input
          type="text"
          className="input"
          {...getChangeHandlers("username")}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          className="input"
          {...getChangeHandlers("password")}
        />
      </label>

      <button type="submit" className="btn">
        {isSignup ? "Sign up" : "Login"}
      </button>
    </Form>
  );
});
