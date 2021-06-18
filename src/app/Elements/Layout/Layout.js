import React, { Component } from 'react';
import { connect } from 'react-redux';
import { urls as app_urls } from 'app/Router/paths'
import { URL_title } from 'paths.js'

import LoginButton from 'app/User/LoginButton'
import Link from 'app/Router/Link'

import Error from 'app/App/Error'
import Header from 'app/Elements/Layout/Header'
import Footer from 'app/Elements/Layout/Footer'
import Session from 'app/Vocabulary/Elements/Session'

const fullscreen = [
  'VOCABULARY_PLAY',
].map(i => app_urls[i].url)

class Layout extends React.Component {
  render() {
    const is_fullscreen = fullscreen.includes(this.props.route.pathname)
    return (
      <div id="container">
        <Error/>
        {!is_fullscreen && <Header/>}
        <div id="content">
          {!is_fullscreen && <Session/>}
          {this.props.children}
        </div>
        {!is_fullscreen && <Footer/>}
      </div>
    )
  }
}
export default connect(state => ({
  route: state.route,
}))(Layout)
