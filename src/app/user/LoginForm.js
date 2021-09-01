import { connect } from "react-redux";
import React from "react";
import { login } from "app/user/actions";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { existsSchedule, termsInSchedule } from "app/user/actions";

import errors from "app/app/error/messages";

class Form2 extends React.Component {
  constructor(props) {
    super(props);
    this.captcha_element = React.createRef();
    this.state = {
      step: 1,
      type: this.props.type, // Either "signup" or "login"
    };
  }
  componentDidMount = () => {
    if (this.props.user) {
      setTimeout(() => {
        // VIRKAR EKKI! Er keyrt aftur eftir submit af einhverjum ástæðum
        // updateURL("/settings");
      }, 100);
    }
  };
  submit = async (values, setSubmitting) => {
    this.setState(values);

    // /* Execute invisible captcha */
    // if (!this.state.captcha_token && process.env.REACT_APP_HCAPTCHA_SITEKEY) {
    //   this.setState({
    //     message: "Verifying...",
    //     awaitingCaptcha: true,
    //   });
    //   this.captcha_element.current.execute();
    //   setSubmitting && setSubmitting(false);
    //   return;
    // }

    const error = await login({
      ...this.state,
      ...values,
    });

    if (error) {
      setSubmitting && setSubmitting(false);
      this.setState({
        error: errors[error] || error,
      });
    }
  };
  render() {
    const error = this.state.error && (
      <div className="form-error">{this.state.error}</div>
    );
    const message = this.state.message && (
      <div className="">
        <b>{this.state.message}</b>
      </div>
    );
    const parent = this;
    const { submit } = parent;
    const isSignup = this.props.type === "signup";

    return (
      <div>
        {this.props.above}

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            save_progress: "yes",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username.trim()) {
              errors.username = "(required)";
            }
            if (values.email && !/@/.test(values.email)) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "(required)";
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
                  {isSignup ? "Choose a username:" : "Username or email:"}{" "}
                  <ErrorMessage
                    name="username"
                    component="span"
                    className="form-error"
                  />
                </div>
                <Field type="text" name="username" />
              </label>

              <label>
                <div>
                  {isSignup ? "Choose a password:" : "Password:"}{" "}
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="form-error"
                  />
                </div>
                <Field type="password" name="password" />
              </label>

              {isSignup && (
                <label>
                  <div>
                    Email <span className="gray">(optional)</span>:{" "}
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="form-error"
                    />
                  </div>
                  <Field type="email" name="email" />
                </label>
              )}

              {isSignup && existsSchedule() && (
                <div className="form-section">
                  You have already studied {termsInSchedule()} term
                  {termsInSchedule() > 1 ? "s" : ""} while logged out. Do you
                  want to:
                  <br />
                  <label>
                    <Field type="radio" name="save_progress" value="yes" />
                    Save progress to your new account
                  </label>
                  <label>
                    <Field type="radio" name="save_progress" value="no" />
                    Discard progress
                  </label>
                  <br />
                </div>
              )}

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

              <button type="submit" className="big" disabled={isSubmitting}>
                {isSignup ? "Continue" : "Log in"}
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
  user: state.user,
  vocabulary: state.vocabulary,
}))(Form2);
