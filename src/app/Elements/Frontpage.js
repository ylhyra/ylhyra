import React from 'react'
import { connect } from 'react-redux';
import Link from 'app/Router/Link'


const Screen = (props) => (
  <div>
    <div>
      <Link href={'VOCABULARY'} className="button">Start learning</Link>
    </div>
    {!props.user &&
      <Link href={'LOG_IN'}>Already have an account?</Link>
    }
  </div>
)

export default connect(state => ({
  user: state.user,
}))(Screen)
