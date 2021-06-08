import { connect } from 'react-redux';
import React from 'react'
import { Link } from 'react-router-dom'
import { history, urls } from 'User/Routes/router'

// todo: minimum

class Form2 extends React.Component {
  componentDidMount() {
    if (!this.props.user) {
      history.push(urls.SIGN_UP)
    }
  }
  render() {
    return (
      <div>
        An Ylhýra account is available on a <b>pay-what-you-want</b> basis. If you want to pay nothing, just write "0".
        <form>
          <label>
            Price:
            <input type="text" value="15 U.S. dollars"/>
          </label>
          <button type="submit">Continue</button>
        </form>
      </div>
    )
  }
}
export default connect(state => ({
  user: state.user,
}))(Form2)
