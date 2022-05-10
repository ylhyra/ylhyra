import { login } from "flashcards/user/actions";
import type { LoginRequest } from "flashcards/user/login.server";
import { Observer } from "mobx-react-lite";
import { form } from "modules/form";
import React from "react";
import { useLocation } from "react-router";

export const Login = () => {
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";

  const { Form, getChangeHandlers, setFormValues } = new form({
    onSubmit: login,
    values: {
      username: "",
      email: "",
      password: "",
      isLoginOrSignup: isSignup ? "signup" : "login",
    } as LoginRequest,
  });

  return (
    <Observer>
      {() => (
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
      )}
    </Observer>
  );
};
