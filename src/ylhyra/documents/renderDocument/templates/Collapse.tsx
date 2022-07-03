import React, { Component, PropsWithChildren } from "react";

class Collapse extends Component<PropsWithChildren> {
  state = {
    open: false,
  };
  render() {
    return (
      <div className="collapse">
        {this.state.open ? (
          <div className="data">{this.props.children}</div>
        ) : (
          <div
            className="button"
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
