import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'app/Router/Link'

class Session extends Component {
  render() {
    const { session } = this.props.vocabulary
    return (
      <div id="">
        {session ? <div>
          <Link to="VOCABULARY_PLAY">
            {session.getPercentageRemaining()}% remaining
          </Link>
        </div>: 'No session'}
      </div>
    )
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(Session)
