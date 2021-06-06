import React from 'react'
import { Link } from 'react-router-dom'
import { urls } from 'Vocabulary/screens/router'

export default () => (
  <div>
    <label>
      Username:
      <input type="text"/>
    </label>
    Email (optional):
    <input type="text"/>
    Password:
    <input type="text"/>
  </div>
)
