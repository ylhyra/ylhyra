import { connect, Provider } from "react-redux";
import { open } from "documents/render/elements/Speed_reading/actions/actions";
import React from "react";
import ReactDOM from "react-dom";
import SpeedReader from "documents/render/elements/Speed_reading";
import store from "app/app/store";

export const SpeedReaderSetup = () => {
  /* Book not found */
  if (
    ($(".book").length === 0 && store.getState().route.pathname === "Ylhýra") ||
    store.getState().route.pathname === "Text:Frontpage"
  )
    return;
  if ($(".book").length !== 1) return;
  $("#catlinks").before('<div id="speed-reader-button-container"></div>');
  $("#container").after('<div id="speed-reader-container"></div>');

  ReactDOM.render(
    <button className="small" onClick={open}>
      Speed read
    </button>,
    document.getElementById("speed-reader-button-container")
  );
  ReactDOM.render(
    <Provider store={store}>
      <SpeedReaderContainer />
    </Provider>,
    document.getElementById("speed-reader-container")
  );
};

export default SpeedReaderSetup;

class _SpeedReaderContainer extends React.Component {
  render() {
    if (this.props.speed_reader.open) {
      // window.listenerCount = 0 /* Turn off mousemove listener for text popups */
      return <SpeedReader />;
    }
    return null;
  }
}
const SpeedReaderContainer = connect((state) => ({
  speed_reader: state.speed_reader,
}))(_SpeedReaderContainer);

// setTimeout(()=>{
//   SpeedReaderSetup() // TEMP!!
// },100)
