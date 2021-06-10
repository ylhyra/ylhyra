import React, { Component } from 'react';
import axios from 'User/App/axios'
import { withRouter } from "react-router";
import NotFound from 'User/Routes/404'

import { html2json, json2html } from 'User/App/functions/html2json'
import Parse from 'User/Parse'
import Traverse from 'User/Render/Traverse'

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
    return Traverse(Parse({ html: this.state.data.content }))
  }
}
export default withRouter(Content)
