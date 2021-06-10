import React from 'react'
import { connect } from 'react-redux';
import Link from 'app/App/Link'
import { urls } from 'app/Routes/router'

const Screen = (props) => (
  <div>
    <div>
      <Link to={urls.VOCABULARY_SETUP} className="button">Start learning</Link>
    </div>
    {!props.user &&
      <Link to={urls.LOG_IN}>Already have an account?</Link>
    }
  </div>
)

export default connect(state => ({
  user: state.user,
}))(Screen)
