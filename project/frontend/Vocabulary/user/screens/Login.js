import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'Vocabulary/screens/router'

export default () => (
  <div>
    <form>
      <label>
        Username or email:
        <input type="text"/>
      </label>
      <label>
        Password:
        <input type="password"/>
      </label>
      <button type="submit">Log in</button>
    </form>
  </div>
)
