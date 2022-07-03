import React, { PropsWithChildren } from "react";

class Hide extends React.Component<PropsWithChildren> {
  state = {
    open: false,
  };
  render() {
    return (
      <div className="collapse">
        <div
          className="button"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          {this.state.open ? "Hide answer" : "Show answer"}
        </div>

        {this.state.open && <div>{this.props.children}</div>}
      </div>
    );
  }
}

export default Hide;
