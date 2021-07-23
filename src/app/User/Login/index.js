import { updateURL } from "app/Router/actions";
import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { login } from "app/User/actions";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "app/App/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import store from "app/App/store";

import errors from "app/App/Error/messages";

class Form2 extends React.Component {
  constructor(props) {
    super(props);
    this.captcha_element = React.createRef();
    this.state = {
      step: 1,
      type: this.props.type, // Either "signup" or "login"
    };
  }
  submit = async (values, setSubmitting) => {
    this.setState({ ...values });

    /* Execute invisible captcha */
    if (!this.state.captcha_token && process.env.REACT_APP_HCAPTCHA_SITEKEY) {
      this.setState({
        message: "Verifying...",
        awaitingCaptcha: true,
      });
      this.captcha_element.current.execute();
      setSubmitting && setSubmitting(false);
      return;
    }

    const response = (
      await axios.post("/api/user", {
        ...this.state,
        ...values,
      })
    ).data;

    setSubmitting && setSubmitting(false);
    if (response.error) {
      this.setState({
        error: errors[response.error] || response.error,
      });
      return;
    }

    const { user_id, username, did_user_exist } = response;
    login({ username, user_id });

    if (!did_user_exist) {
      if (process.env.REACT_APP_PWYW === "on") {
        updateURL("PAY");
      } else {
        updateURL("/");
      }
    } else {
      updateURL("/");
    }
  };
  render() {
    const submit = this.submit;
    const error = this.state.error && (
      <div className="error">{this.state.error}</div>
    );
    const message = this.state.message && (
      <div className="">
        <b>{this.state.message}</b>
      </div>
    );
    const parent = this;
    const isSignup = this.props.type === "signup";

    return (
      <div>
        {this.props.above}

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.username.trim()) {
              errors.username = "Required";
            }
            if (values.email && !/@/.test(values.email)) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            submit(values, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>
                  {isSignup ? "Choose a username" : "Username or email:"}
                </div>
                <ErrorMessage name="username" component="div" />
                <Field type="text" name="username" />
              </label>

              <label>
                <div>{isSignup ? "Choose a password" : "Password:"}</div>
                <ErrorMessage name="password" component="div" />
                <Field type="password" name="password" />
              </label>

              {isSignup && (
                <label>
                  <div>
                    Email <small className="small gray">(optional)</small>:
                  </div>
                  <ErrorMessage name="email" component="div" />
                  <Field type="email" name="email" />
                </label>
              )}

              {/* {process.env.NODE_ENV === "development" && (
                <div>
                  You have already studied X terms while logged out. Do you want
                  to:
                  <br />
                  <input type="radio" id="save_progress" name="save" checked />
                  <label for="save_progress">
                    Continue with that schedule on my account
                  </label>
                  <br />
                  <input type="radio" id="not_save_progress" name="save" />
                  <label for="not_save_progress">
                    Delete the logged-out study sessions and start from zero
                    with this new account
                  </label>
                  <br />
                </div>
              )} */}

              {error}
              {message}

              {process.env.REACT_APP_HCAPTCHA_SITEKEY && (
                <HCaptcha
                  size="invisible"
                  ref={parent.captcha_element}
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
                  onVerify={(value) => {
                    parent.setState({ captcha_token: value });
                    if (parent.state.awaitingCaptcha) {
                      parent.submit({});
                    }
                  }}
                />
              )}

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default connect((state) => ({
  route: state.route,
}))(Form2);
