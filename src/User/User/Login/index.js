import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import axios from 'User/App/axios'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory } from "react-router-dom"
import { withRouter } from "react-router";
import store from 'User/App/store'

import errors from 'User/App/Error/messages'

class Form2 extends React.Component {
  state = {
    step: 1
  }
  submit = async(values, setSubmitting) => {
    let url = values.token ? '/api/user/token' : '/api/user'
    const response = (await axios.post(url, {
      ...this.state,
      ...values,
    })).data
    console.log(response)
    if (response.error) {
      this.setState({
        error: errors[response.error],
      })
    }
    /* Step 1 done */
    else if (this.state.step === 1) {
      this.setState({
        step: 2,
        long_token: response.long_token,
      })
    }
    /* Step 2 done */
    else {
      const { user_id, user } = response
      store.dispatch({
        type: 'LOAD_USER',
        content: {
          user,
          user_id,
        },
      })
      this.props.history.push(urls.PAY)
    }
    setSubmitting(false)
  }
  render() {
    const submit = this.submit
    const error = this.state.error && <div className="error">{this.state.error}</div>

    if (this.state.step === 1) {
      return (
        <div>

        <div>
          Step 1: Create an account<br/>
          Step 2: Pay what you want
        </div>

        <h2>Create an account</h2>
        An account allows you to save your vocabulary progress and continue the game on other devices.

        <Formik
          initialValues={{ email: 'test@test.xyz' }}
          validate={values => {
            const errors = {};
            if (!values.email.trim()) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())
            ) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            submit(values, setSubmitting)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>Email:</div>
                <ErrorMessage name="email" component="div" />
                <Field type="email" name="email" />
              </label>

              {error}

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>


        {/* {process.env.REACT_APP_HCAPTCHA_SITEKEY &&
          <HCaptcha
            sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
            onVerify={console.log}/>} */}
      </div>
      )
    } else {
      return (
        <div>
        <Formik
          initialValues={{ token: '1234' }}
          validate={values => {
            const errors = {};
            if (!values.token.trim()) {
              errors.token = 'Required';
            } else if (
              !/[0-9]{4}$/.test(values.token.replace(/([^0-9])/g,'').trim())
            ) {
              errors.token = `A token should be four digits`;
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            submit(values, setSubmitting)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>Enter the four digits you received in your email:</div>
                <ErrorMessage name="token" component="div" />
                <Field type="text" name="token" />
              </label>

              {error}

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      )
    }
  }
}
export default withRouter(Form2)
