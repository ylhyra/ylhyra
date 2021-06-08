import axios from 'User/App/axios'
import { url } from 'User/App/url'
import { connect } from 'react-redux'
import { synchronize } from 'Editor/Long_audio/Synchronize'
import React from 'react'
import store from 'User/App/store'
require('User/App/functions/array-foreach-async')

class Inflections extends React.Component {
  state = {}
  componentDidMount = () => {
    // const { analysis, list } = this.props.editor
    // let id_to_possible_values = {}
    // list.arrayOfAllWordIDs.forEachAsync(async (id) => {
    //   await new Promise(async resolve => {
    //     // console.log(analysis[id])
    //     list.words[id].text
    //     const rows = (await axios.post(`${url}/api/inflection/search`, {
    //       word: list.words[id].text
    //     })).data
    //     id_to_possible_values[id] = rows
    //     resolve()
    //   })
    // })
    // this.setState({
    //   id_to_possible_values
    // })
  }
  render() {
    const { analysis, list } = this.props.editor

    return (
      <div className="">
        Uncertain:

        <hr/>
        Certain:


      </div>
    )
  }
}

export default connect(
  state => ({
    editor: state.editor,
  }), {}
)(Inflections)
