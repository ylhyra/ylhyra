import { login } from "flashcards/user/actions";
import { Observer } from "mobx-react-lite";
import { form } from "modules/form";
import React from "react";
import { useLocation } from "react-router";
import type { LoginRequest } from "flashcards/user/login.server";

export const Login = () => {
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";

  const { Form, getFieldProps, setValues } = new form({
    onSubmit: login,
    initialValues: {
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
              {...getFieldProps("username")}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              className="input"
              {...getFieldProps("password")}
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
