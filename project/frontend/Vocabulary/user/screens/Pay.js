import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'Vocabulary/screens/router'

export default () => (
  <div>
    An Ylhýra account is available on a <b>pay-what-you-want</b> basis. If you want to pay nothing, just write "0".
    <form>
      <label>
        Price:
        <input type="text"/>
      </label>
      <button type="submit">Continue</button>
    </form>
  </div>
)
