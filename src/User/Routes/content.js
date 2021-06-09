import React, { Component } from 'react';
import axios from 'User/App/axios'
import { withRouter } from "react-router";
import NotFound from 'User/Routes/404'

class Content extends Component {
  state = {}
  async componentDidMount() {
    axios.get('/api/content', {
      params: {
        title: this.props.history.location.pathname.replace(/^\//, '')
      }
    }).then(({ data }) => {
      this.setState({ data })
    }).catch(error => {
      if (error.response && error.response.status === 404) {
        this.setState({ error: 404 })
      }
    })
  }
  render() {
    if (this.state.error) return <NotFound/>;
    if (!this.state.data) return <div>Loading...</div>;
    return (
      <div dangerouslySetInnerHTML={{__html: (this.state.data.content)}}/>
    )
  }
}
export default withRouter(Content)
