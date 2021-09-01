import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import store from "app/app/store";
// require('array-sugar')
import { checkKey, mouseListener } from "./actions/eventListeners";
import { start, startStop, prevWord, close, reset } from "./actions/actions";
import { load } from "./actions/load";
import {
  isBrowser,
  hasLocalStorage,
  supportsTouch,
} from "app/app/functions/isBrowser";
import {
  TextEventListenersOn,
  TextEventListenersOff,
} from "documents/read/touch";

@connect((state) => ({
  speed_reader: state.speed_reader,
}))
class SpeedReader extends React.Component {
  componentDidMount = () => {
    load();
    $("body").addClass("unscrollable");
    // $('#speed-reader').on('click', startStop)
    document.addEventListener("keydown", checkKey);
    !supportsTouch && document.addEventListener("mousemove", mouseListener);
    TextEventListenersOff();
  };
  componentWillUnmount = () => {
    $("body").removeClass("unscrollable");
    document.removeEventListener("keydown", checkKey);
    !supportsTouch && document.removeEventListener("mousemove", mouseListener);
    TextEventListenersOn();
  };
  render() {
    if (!this.props.speed_reader.open) {
      // window.listenerCount = 0 /* Turn off mousemove listener for text popups */
      return null;
    }

    const { started, wpm, cur, words, running, skin, mouse_hidden, done } =
      this.props.speed_reader;

    let classes = [];
    classes.push(skin);
    running && classes.push("running");
    mouse_hidden && running && classes.push("mouse_hidden");
    return (
      <div
        id="speed-reader"
        className={classes.join(" ")}
        onClick={startStop}
        // onClick={supportsTouch?undefined:startStop}
        // onTouchStart={startStop}
      >
        {started ? done ? <DoneScreen /> : <PlayScreen /> : <AboutScreen />}
        {words.length > 0 && (
          <div
            id="speed-reader-status"
            style={{ width: (cur / words.length) * 100 + "%" }}
          ></div>
        )}
      </div>
    );
  }
}

export default SpeedReader;

class Header_ extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } =
      this.props.speed_reader;
    return (
      <div
        id="speed-reader-header"
        className="noclick"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          onClick={() => {
            stop();
            store.dispatch({
              type: "SPEED_READER_UPDATE",
              started: false,
            });
          }}
          className={started ? "" : "inactive"}
        >
          Settings
        </a>
        {started && (
          <a onClick={prevWord} className={cur > 0 ? "" : "inactive"}>
            Previous word
          </a>
        )}
        {(started || cur > 0) && <a onClick={reset}>Restart</a>}
        <a onClick={startStop}>
          <b>{running ? "Pause" : "Play"}</b>
        </a>

        <div className="spacer" />
        <a onClick={close}>Exit</a>
      </div>
    );
  }
}
const Header = connect((state) => ({
  speed_reader: state.speed_reader,
}))(Header_);

class PlayScreen_ extends React.Component {
  render() {
    const {
      started,
      wpm,
      cur,
      words,
      running,
      skin,
      mouse_hidden,
      showTranslation,
      done,
    } = this.props.speed_reader;
    return (
      <div id="speed-reader-inner">
        <div className="speedreader_section">
          <Header />
          <div className="speedreader_spacer" />
          <div className="speedreader_translation">
            {(!running || showTranslation) && (words[cur].translation || "")}
          </div>
        </div>
        <div id="speedreader_output">
          <Word word={words[cur].text || ""} key={cur} />
        </div>
        <div className="speedreader_section">
          <div className="speedreader_spacer" />
          <div className="speedreader_translation">
            {!running && (words[cur].sentenceTranslation || "")}
          </div>
        </div>
      </div>
    );
  }
}
const PlayScreen = connect((state) => ({
  speed_reader: state.speed_reader,
}))(PlayScreen_);

class DoneScreen_ extends React.Component {
  render() {
    const {
      started,
      wpm,
      cur,
      words,
      running,
      skin,
      mouse_hidden,
      showTranslation,
      done,
    } = this.props.speed_reader;
    return (
      <div id="speed-reader-inner">
        <div className="speedreader_section">
          <Header />
        </div>
        <div
          id="speedreader_output"
          style={{ textAlign: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Done!</h2>
          <p>
            You read this text at {wpm} words per minute.{" "}
            {wpm < 700 &&
              "Try to slowly increase your speed until you can no longer read any faster:"}
          </p>
          {wpm < 700 && (
            <div>
              <button
                onClick={() => {
                  store.dispatch({
                    type: "SPEED_READER_UPDATE",
                    wpm: wpm + 25,
                  });
                  start();
                }}
              >
                Go faster ({wpm + 25} words per minute)
              </button>
            </div>
          )}

          <div>
            <button onClick={start}>Repeat ({wpm} words per minute)</button>
          </div>

          {wpm > 25 && (
            <div>
              <button
                onClick={() => {
                  store.dispatch({
                    type: "SPEED_READER_UPDATE",
                    wpm: wpm - 25,
                  });
                  start();
                }}
              >
                Go slower ({wpm - 25} words per minute)
              </button>
            </div>
          )}
        </div>
        <div className="speedreader_section"></div>
      </div>
    );
  }
}
export const DoneScreen = connect((state) => ({
  speed_reader: state.speed_reader,
}))(DoneScreen_);

class AboutScreen_ extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } =
      this.props.speed_reader;

    return (
      <div id="speed-reader-inner">
        <Header />
        <div id="speed-reader-logo" onClick={close}>
          Ylhýra
        </div>
        <h1>Speed reading mode</h1>
        <div>
          <Settings />
          <br />
          <div className="noclick" onClick={(e) => e.stopPropagation()}>
            <button id="start" onClick={start}>
              Start
            </button>
          </div>
        </div>
        <br />
        <br />
        <div>
          <p>
            This is an exercise that trains you to immediately recognize words
            just from their shapes instead of having to read each letter. Being
            able to immediately recognize words makes reading faster, more
            enjoyable, and allows you to comprehend longer text with more ease.{" "}
          </p>
          <p>
            This exercise also trains you to read without giving up half-way
            through.
          </p>
          <p>
            We recommend starting with a low speed (75 words per minute). When
            you can comfortably read at that speed, increase the speed by +25
            and read the same text again. Repeat the process until you’re able
            to comfortaby read the text at 200 words per minute.
          </p>
          <p>
            To use this tool with other text, click{" "}
            <a href="https://speedreader.ylhyra.is/">here</a>.
          </p>
        </div>
        <br />
        <div>
          <div id="tutorial" className="gray">
            <div className="only-desktop">
              Click "space" to pause and start, <br /> "left" and "right" arrow
              buttons to go backwards and forwards,
              <br /> "up" and "down" arrow buttons to change speed.
            </div>
            <div className="only-mobile">Click anywhere to start and stop</div>
          </div>
        </div>
      </div>
    );
  }
}
const AboutScreen = connect((state) => ({
  speed_reader: state.speed_reader,
}))(AboutScreen_);

class Word extends React.Component {
  componentDidMount = () => {
    if (!this.props.word) return null;
    const el = document.getElementById("speedreader_output");
    if (!el) return;
    const outputWidth = el.getBoundingClientRect().width;
    const w = document.getElementById("speedreader_word");
    const wordWidth = w.getBoundingClientRect().width;
    let leftpad = (outputWidth - wordWidth * 0.6) / 2 - 10;
    if (wordWidth >= leftpad / 2) {
      leftpad = Math.min(leftpad, outputWidth - wordWidth);
    }
    w.setAttribute(
      "style",
      `display:block;width:${Math.ceil(wordWidth)}px;margin-left:${Math.floor(
        Math.max(0, leftpad)
      )}px`
    );
  };
  shouldComponentUpdate = () => {
    return false;
  };
  render() {
    return <span id="speedreader_word">{this.props.word}</span>;
  }
}

const handleChange = (prop, value) => {
  store.dispatch({
    type: "SPEED_READER_UPDATE",
    [prop]: value,
  });
};

class Settings_ extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } =
      this.props.speed_reader;
    let available_speeds = [];
    for (let i = 25; i <= 600; i += 25) {
      available_speeds.push(i);
    }

    return (
      <div className="noclick" onClick={(e) => e.stopPropagation()}>
        <div>
          <label htmlFor="wpm">Speed: </label>
          <select
            id="wpm"
            value={wpm}
            onChange={(e) => handleChange("wpm", e.target.value)}
          >
            {available_speeds.map((j) => (
              <option value={j} key={j}>
                {j} words per minute
              </option>
            ))}
          </select>
          <span id="time" className="gray"></span>
        </div>
        <div>
          <label htmlFor="skin">Colors: </label>
          <select
            id="skin"
            value={skin}
            onChange={(e) => handleChange("skin", e.target.value)}
          >
            <option value="blackonwhite">
              Black text on a white background
            </option>
            <option value="blackonlight">
              Black text on an orange background
            </option>
            <option value="whiteonblack">
              White text on a black background
            </option>
            <option value="yellowonblack">
              Yellow text on a black background
            </option>
          </select>
        </div>
      </div>
    );
  }
}
const Settings = connect((state) => ({
  speed_reader: state.speed_reader,
}))(Settings_);
