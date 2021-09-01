import React, { Component } from "react";

class Collapse extends Component {
  state = {};
  render() {
    return (
      <div class="collapse">
        {this.state.open ? (
          <div className="data">{this.props.children}</div>
        ) : (
          <div
            class="button"
            onClick={() => {
              this.setState({
                open: true,
              });
            }}
          >
            Show answer
          </div>
        )}
      </div>
    );
  }
}
export default Collapse;
