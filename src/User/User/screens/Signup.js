import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'User/Routes/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
export default () => (
  <div>
    <Link to={urls.LOG_IN}>Already have an account?</Link>

    <div>
      Step 1: Create an account<br/>
      Step 2: Pay what you want
    </div>

    <h2>Create an account</h2>
    An account allows you to save your vocabulary progress and continue the game on other devices.
    <form method="post">
      <label>
        <div>Choose a username:</div>
        <input type="text"/>
      </label>
      <label>
        <div>What is your email? (optional):</div>
        <input type="text"/>
      </label>
      <label>
        <div>Choose a password:</div>
        <input type="text"/>
      </label>

      {/* {process.env.REACT_APP_HCAPTCHA_SITEKEY &&
        <HCaptcha
          sitekey={process.env.REACT_APP_HCAPTCHA_SITEKEY}
          onVerify={console.log}/>} */}

      <button type="submit">Continue</button>
    </form>
  </div>
)
