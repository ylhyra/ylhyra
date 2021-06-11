import React from 'react'
import { connect } from 'react-redux';
import Link from 'app/Router/Link'
import { urls } from 'app/Routes/router'

const Screen = (props) => (
  <div>
    Are you a beginner?
    <div>
      <button>Yes, I'm a beginner</button>
      <button>No, I already speak some Icelandic</button>
    </div>
    {!props.user &&
      <Link href={urls.LOG_IN}>Already have an account?</Link>
    }
  </div>
)

export default connect(state => ({
  user: state.user,
}))(Screen)
