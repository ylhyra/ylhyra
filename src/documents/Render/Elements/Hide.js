import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import store from "app/App/store";
import { html2json, json2html } from "app/App/functions/html2json";

class Hide extends React.Component {
  state = {};
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
