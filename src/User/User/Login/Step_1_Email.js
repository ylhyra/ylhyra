import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik';

export const ERROR_EMAIL_COULD_NOT_BE_SENT = 1
export const ERROR_INCORRECT_TOKEN = 2
export const ERROR_INCOMPLETE_FIELD = 6
export const ERROR_USER_ALREADY_EXIST = 3
export const ERROR_USER_DOESNT_EXIST = 4

class Form2 extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     email: '',
  //     token: '',
  //   };
  // }
  // handleChange = (name, event) => {
  //   this.setState({
  //     [name]: event.target.value,
  //   });
  // }
  // handleSubmit = async(event) => {
  //   event.preventDefault();
  //   if (this.state.disabled) return;
  //   this.setState({ disabled: true })
  //
  //   /* Step 1 - Email */
  //   if (!this.state.emailSent) {
  //     if (!this.state.email.trim()) {
  //       this.setState({ error: ERROR_INCOMPLETE_FIELD })
  //     } else {
  //       const data = (await axios.post(`/api/user`, this.state)).data
  //       this.setState({ emailSent: true })
  //     }
  //   }
  //   /* Step 2 - Token */
  //   else {
  //
  //   }
  //
  //   this.setState({ disabled: false })
  // }
  render() {
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






          {/* <form onSubmit={this.handleSubmit}>
            <label>
              <div>Email:</div>

              {this.state.error===ERROR_INCOMPLETE_FIELD && <div className="error">
                <b>Please fill in this field</b>
              </div>}
              <input type="email" name="email"
                value={this.state.email||''}
                onChange={(e)=>this.handleChange('email',e)}/>
            </label>

            <button type="submit">Continue</button>
          </form> */}


                      {/* {process.env.REACT_APP_HCAPTCHA_SITEKEY &&
                        <HCaptcha
                          sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
                          onVerify={console.log}/>} */}
        </div>
      )
    // } else {
    //   return (
    //     <div>
    //       <form onSubmit={this.handleSubmit}>
    //         <label>
    //           <div>Enter the four digits you received in your email:</div>
    //           <input type="text" name="token"
    //             value={this.state.token||''}
    //             onChange={(e)=>this.handleChange('token',e)}/>
    //         </label>
    //         <button type="submit">Continue</button>
    //       </form>
    //     </div>
    //   )
    // }
  }
}
export default Form2
