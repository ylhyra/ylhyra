import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory } from "react-router-dom"
import { withRouter } from "react-router";

export const ERROR_EMAIL_COULD_NOT_BE_SENT = 'ERROR_EMAIL_COULD_NOT_BE_SENT'
export const ERROR_INCORRECT_TOKEN = 'ERROR_INCORRECT_TOKEN'
export const ERROR_INCOMPLETE_FIELD = 'ERROR_INCOMPLETE_FIELD'
export const ERROR_USER_ALREADY_EXIST = 'ERROR_USER_ALREADY_EXIST'
export const ERROR_USER_DOESNT_EXIST = 'ERROR_USER_DOESNT_EXIST'

class Form2 extends React.Component {
  state = {
    step: 1
  }
  submit = async(values) => {
    const response = (await axios.post(`/api/user`, {
      ...this.state,
      values,
    })).data
    console.log(response)
    if (response.error) {
      this.setState({
        error: response.error,
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
      console.log('Done :)')
      this.props.history.push(urls.PAY)
    }
  }
  render() {
    const submit = this.submit
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
          initialValues={{ email: '' }}
          validate={values => {
            const errors = {};
            if (!values.email.trim()) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())
            ) {
              errors.email = 'Invalid email address';
            }
            if(this.state.error){
              errors.email = this.state.error
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            submit(values)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>Email:</div>
                <ErrorMessage name="email" component="div" />
                <Field type="email" name="email" />
              </label>
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
          initialValues={{ token: '' }}
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
            submit(values)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>Enter the four digits you received in your email:</div>
                <ErrorMessage name="token" component="div" />
                <Field type="text" name="token" />
              </label>
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
