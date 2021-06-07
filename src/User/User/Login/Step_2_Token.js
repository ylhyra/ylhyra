import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik';

class Form2 extends React.Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={{ token: '' }}
          validate={values => {
            const errors = {};
            if (!values.token.trim()) {
              errors.email = 'Required';
            } else if (
              !/[0-9]{4}$/.test(values.token.replace(/(^[0-9])/g).trim())
            ) {
              errors.token = 'Invalid token';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
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
export default Form2
