import { connect } from "react-redux";
import React from "react";

class Inflections extends React.Component {
  state = {};
  componentDidMount = () => {
    // const { analysis, list } = this.props.editor
    // let id_to_possible_values = {}
    // list.arrayOfAllWordIDs.forEachAsync(async (id) => {
    //   await new Promise(async resolve => {
    //     // console.log(analysis[id])
    //     list.words[id].text
    //     const rows = (await axios.post(`/api/inflection/search`, {
    //       word: list.words[id].text
    //     })).data
    //     id_to_possible_values[id] = rows
    //     resolve()
    //   })
    // })
    // this.setState({
    //   id_to_possible_values
    // })
  };
  render() {
    return (
      <div className="">
        Uncertain:
        <hr />
        Certain:
      </div>
    );
  }
}

export default connect(
  (state) => ({
    editor: state.editor,
  }),
  {}
)(Inflections);
