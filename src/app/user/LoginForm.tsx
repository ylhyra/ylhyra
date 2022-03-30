import errors from "app/app/error/messages";
import { withPlural } from "app/app/functions/simplePlural";
import { RootState } from "app/app/store";
import { existsSchedule, login } from "app/user/actions";
import { countTermsInSchedule } from "app/vocabulary/actions/functions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";

class Form2 extends React.Component<
  {
    route: RootState["route"];
    user: RootState["user"];
    vocabulary: RootState["vocabulary"];
    type: "signup" | "login";
    above: React.Component;
  },
  {
    step: Number;
    error?: string;
    message?: string;
  }
> {
  constructor(props) {
    super(props);
    // this.captcha_element = React.createRef();
    this.state = {
      step: 1,
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

    setSubmitting && setSubmitting(false);

    if (error) {
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
            const errors: any = {};
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
                  You have already studied{" "}
                  {withPlural(countTermsInSchedule(), "term")} while logged out.
                  Do you want to:
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

              {!isSubmitting && error}
              {message}

              {/*{process.env.REACT_APP_HCAPTCHA_SITEKEY && (*/}
              {/*  <HCaptcha*/}
              {/*    size="invisible"*/}
              {/*    ref={parent.captcha_element}*/}
              {/*    sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}*/}
              {/*    onVerify={(value) => {*/}
              {/*      parent.setState({ captcha_token: value });*/}
              {/*      if (parent.state.awaitingCaptcha) {*/}
              {/*        parent.submit({});*/}
              {/*      }*/}
              {/*    }}*/}
              {/*  />*/}
              {/*)}*/}

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
export default connect((state: RootState) => ({
  route: state.route,
  user: state.user,
  vocabulary: state.vocabulary,
}))(Form2);
