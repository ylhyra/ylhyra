import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import axios from 'axios'

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = (name, event) => {
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit = async(event) => {
    console.log(this.state)
    event.preventDefault();

    const data = (await axios.post(`/api/user`, this.state)).data
    console.log(data)
  }
  render() {
    return (
      <div>
        <Link to={urls.LOG_IN}>Already have an account?</Link>

        <div>
          Step 1: Create an account<br/>
          Step 2: Pay what you want
        </div>

        <h2>Create an account</h2>
        An account allows you to save your vocabulary progress and continue the game on other devices.
        <form onSubmit={this.handleSubmit}>
          <label>
            <div>Choose a username:</div>
            <input type="text"
              value={this.state.username||''}
              onChange={(e)=>this.handleChange('username',e)}/>
          </label>
          <label>
            <div>What is your email? (optional):</div>
            <input type="text"
              value={this.state.email||''}
              onChange={(e)=>this.handleChange('email',e)}/>
          </label>
          <label>
            <div>Choose a password:</div>
            <input type="password"
              value={this.state.password||''}
              onChange={(e)=>this.handleChange('password',e)}/>
          </label>

          {/* {process.env.REACT_APP_HCAPTCHA_SITEKEY &&
            <HCaptcha
              sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
              onVerify={console.log}/>} */}

          <button type="submit">Continue</button>
        </form>
      </div>
    )
  }
}
export default Form
