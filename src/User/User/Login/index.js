import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import axios from 'axios'
import Step_1_Email from './Step_1_Email'
import Step_2_Token from './Step_2_Token'

export const ERROR_EMAIL_COULD_NOT_BE_SENT = 1
export const ERROR_INCORRECT_TOKEN = 2
export const ERROR_INCOMPLETE_FIELD = 6
export const ERROR_USER_ALREADY_EXIST = 3
export const ERROR_USER_DOESNT_EXIST = 4

class Wrapper extends React.Component {
  //   /* Step 1 - Email */
  //   if (!this.state.emailSent) {
  //     if (!this.state.email.trim()) {
  //       this.setState({ error: ERROR_INCOMPLETE_FIELD })
  //     } else {
  //       const data = (await axios.post(`/api/user`, this.state)).data
  //       this.setState({ emailSent: true })
  //     }
  //   }
  //
  step1done = () => {}
  // step1done = () => {}
  render() {
    return <Step_1_Email onFinish={this.step1done}/>
    // return <Step_2_Token/>
  }
}
export default Wrapper
