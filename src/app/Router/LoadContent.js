import React, { Component } from 'react';
import axios from 'app/App/axios'
import NotFound from 'documents/Templates/404'
import { connect } from 'react-redux';
import { getURL } from 'app/Router/actions'
import { html2json, json2html } from 'app/App/functions/html2json'
import Parse from 'documents/Parse'
import { updateURL } from 'app/Router/actions'
import Render from 'documents/Render'
import VocabularyHeader from 'app/Vocabulary/Elements/VocabularyHeader'
// import markdown_to_html from 'documents/Compile/markdown_to_html'

let cache = {}

class Content extends Component {
  state = {}
  async componentDidMount() {
    this.get()
  }
  get() {
    let url = getURL()
    if (url in cache) {
      this.set(url, cache[url])
    } else {
      axios.get('/api/content', {
        params: {
          title: url,
        }
      }).then(async({ data }) => {
        this.set(url, data)
        cache[url] = data
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          this.setState({ error: 404 })
        }
      })
    }
  }
  set(url, data) {
    this.setState({ data })
    // TODO: Go to section, highlight
    url = data.redirect_to || url
    updateURL(url, data.title, true)
  }
  render() {
    if (this.state.error) return <NotFound/>;
    if (!this.state.data) return <div>Loading...</div>;
    // console.log(Parse({ html: this.state.data.content }))
    return <div>
      <VocabularyHeader header_data={this.state.data.header}/>
      {Render({
        json: Parse({
          html: /*markdown_to_html*/(this.state.data.content)
        }).parsed
      })}
    </div>

  }
}
export default connect(state => ({
  route: state.route,
}))(Content)
