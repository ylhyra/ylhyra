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
  constructor(props) {
    super(props)
    this.captcha_element = React.createRef()
    this.state = {
      step: 1,
      type: this.props.type,
      /* Either "signup" or "login" */
    }
  }
  submit = async(values, setSubmitting) => {
    this.setState({ ...values })

    if (!this.state.captcha_token && process.env.REACT_APP_HCAPTCHA_SITEKEY) {
      this.setState({
        message: 'Verifying...',
        awaitingCaptcha: true,
      })
      this.captcha_element.current.execute()
      setSubmitting && setSubmitting(false)
      return;
    }

    let url = values.token ? '/api/user/token' : '/api/user'
    const response = (await axios.post(url, {
      ...this.state,
      ...values,
    })).data
    console.log(response)

    setSubmitting && setSubmitting(false)
    if (response.error) {
      this.setState({
        error: errors[response.error],
      })
      return;
    }

    this.setState({
      error: null,
      message: null,
      does_user_exist: response.does_user_exist,
    })

    /* Step 1 done */
    if (this.state.step === 1) {
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

      if (!this.state.does_user_exist) {
        this.props.history.push(urls.PAY)
      } else {
        this.props.history.push(urls.MAIN)
      }
    }
  }
  render() {
    const submit = this.submit
    const error = this.state.error && <div className="error">{this.state.error}</div>
    const message = this.state.message && <div className=""><b>{this.state.message}</b></div>
    const parent = this

    if (this.state.step === 1) {
      return (
        <div>

        {this.props.above}

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
              {message}

              {process.env.REACT_APP_HCAPTCHA_SITEKEY &&
                <HCaptcha
                  size="invisible"
                  ref={parent.captcha_element}
                  sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
                  onVerify={value=>{
                    parent.setState({captcha_token:value})
                    if(parent.state.awaitingCaptcha){
                      parent.submit({})
                    }
                  }
                  }/>}

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      )
    } else if (this.state.step === 2) {
      return (
        <div>

        {this.props.type==='signup' && this.state.does_user_exist && (<div>
          You have already created an account with this name. You will be logged in instead.
        </div>)}

        {this.props.type==='login' && !this.state.does_user_exist && (<div>
          <b>An account with this name does not exist</b>. You will be signed up instead.
        </div>)}

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
