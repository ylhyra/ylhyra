import React, { Component } from 'react';
import axios from 'User/App/axios'
import { withRouter } from "react-router";
import NotFound from 'User/Routes/404'

import { html2json, json2html } from 'User/App/functions/html2json'
import Parse from 'documents/Parse'

// import Traverse from 'documents/Render/Traverse'
// import Traverse from 'documents/Render/Traverse'
import Render from 'documents/Render'

class Content extends Component {
  state = {}
  async componentDidMount() {
    this.get()
  }
  get() {
    this.setState({
      pathname: this.props.history.location.pathname,
    })

    const url = this.props.history.location.pathname.replace(/^\//, '')
    axios.get('/api/content', {
      params: {
        title: url,
      }
    }).then(async({ data }) => {
      this.setState({
        data
      })
      if (data.redirect_to) {
        this.props.history.replace('/' +
          data.redirect_to
          // +(data.section ? '#' + data.section : '')
        )
        if (data.section) {
          // TODO: Go to section, highlight
        }
      }
      window.document.title = `${data.title} - Ylhýra`
    }).catch(error => {
      if (error.response && error.response.status === 404) {
        this.setState({ error: 404 })
      }
    })
  }
  componentDidUpdate() {
    if (this.props.history.location.pathname !== this.state.pathname) {
      this.setState({ data: null })
      this.get()
    }
  }
  render() {
    if (this.state.error) return <NotFound/>;
    if (!this.state.data) return <div>Loading...</div>;
    // console.log(Parse({ html: this.state.data.content }))
    return Render({ json: Parse({ html: this.state.data.content }).parsed })
  }
}
export default withRouter(Content)
