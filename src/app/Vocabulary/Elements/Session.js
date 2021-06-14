import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'app/Router/Link'
import Button from 'documents/Templates/Button'

class Session extends Component {
  render() {
    const { session } = this.props.vocabulary
    return (
      <div id="">
        {session ? <div>
          <Button><Link href="VOCABULARY_PLAY">
            Session {session.printTimeRemaining()} remaining. CONTINUE!
          </Link></Button>
        </div>: ''}
      </div>
    )
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(Session)
