import { connect } from 'react-redux';
import React from 'react'
import Link from 'User/App/Link'
import { history, urls } from 'User/Routes/router'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {pay} from 'User/User/actions'

class Form2 extends React.Component {
  componentDidMount() {
    if (!this.props.user) {
      history.push(urls.SIGN_UP)
    }
  }
  render() {
    return (
      <div>
        An Ylhýra account is available on a <b>pay-what-you-want</b> basis. If you want to pay nothing, just write "0".

        <Formik
          initialValues={{ price: '' }}
          validate={values => {
            const errors = {};
            // if (!values.price.trim()) {
            //   errors.price = 'Required';
            // } else if (
            //   !/[0-9]{4}$/.test(values.price.replace(/([^0-9])/g,'').trim())
            // ) {
            //   errors.price = `A price should be four digits`;
            // }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            pay(values)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                Price:
                <ErrorMessage name="price" component="div" />
                <Field type="text" name="price" /> U.S. dollars
              </label>

              <button type="submit" disabled={isSubmitting}>
                Continue
              </button>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}
export default connect(state => ({
  user: state.user,
}))(Form2)
