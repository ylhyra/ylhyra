import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "app/app/store";
import Recorder from "maker/editor/Short_audio/Recorder";

const RenderRecorder = () => {
  if (mw.util.getParamValue("action") !== "edit") return;
  $("#actions").append('<div id="recorder-button-container"></div>');
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <div>
          {/* <button className="editor-button" onClick={record}>
            Record
          </button> */}
          <RecorderButton />
        </div>
      </div>
    </Provider>,
    document.querySelector("#recorder-button-container")
  );
};

class RecorderButton extends React.Component {
  state = {
    open: false,
  };
  render() {
    if (!this.state.open) {
      return (
        <div
          onClick={() => {
            this.setState({ open: true });
          }}
        >
          Start recording
        </div>
      );
    } else {
      return <RecorderWrapper />;
    }
  }
}

class RecorderWrapper extends React.Component {
  onFinish = (filename) => {
    insertAtCaret(`|audio=${filename}`);
    // insertAtCaret(filename)
  };
  render() {
    // if (!this.props.word) return null
    return (
      <div>
        <Recorder onFinish={this.onFinish} />
      </div>
    );
  }
}

export default RenderRecorder;

// From https://stackoverflow.com/a/1064139/426858
function insertAtCaret(text) {
  var txtarea = document.getElementById("wpTextbox1");
  if (!txtarea) {
    return;
  }

  txtarea.focus();
  var scrollPos = txtarea.scrollTop;
  var strPos = 0;
  var br =
    txtarea.selectionStart || txtarea.selectionStart == "0"
      ? "ff"
      : document.selection
      ? "ie"
      : false;
  if (br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart("character", -txtarea.value.length);
    strPos = range.text.length;
  } else if (br == "ff") {
    strPos = txtarea.selectionStart;
  }
  strPos = txtarea.selectionEnd;

  var front = txtarea.value.substring(0, strPos);
  var back = txtarea.value.substring(strPos, txtarea.value.length);
  txtarea.value = front + text + back;
  strPos = strPos + text.length;
  if (br == "ie") {
    txtarea.focus();
    var ieRange = document.selection.createRange();
    ieRange.moveStart("character", -txtarea.value.length);
    ieRange.moveStart("character", strPos);
    ieRange.moveEnd("character", 0);
    ieRange.select();
  } else if (br == "ff") {
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();
  }

  txtarea.scrollTop = scrollPos;
}
