import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import clean from "documents/Render/Elements/Vocabulary/functions/clean";
import {
  ParseHTMLtoObject,
  ParseHTMLtoArray,
  getTextFromReactElement as getText,
} from "documents/Render/Elements/parse";
import ReactDOM from "react-dom";
const isBrowser =
  typeof process === "undefined" ||
  process.type === "renderer" ||
  process.browser === true ||
  process.__nwjs;
let Hammer;
if (isBrowser) {
  Hammer = require("hammerjs");
}

class Element extends Component {
  state = {};
  componentDidMount() {
    const { card } = this.props;
    const correctAnswers = ParseHTMLtoArray(card.icelandic)
      .filter(Boolean)
      .map((x) => x.children);
    const otherOptions = ParseHTMLtoArray(card.other_options)
      .filter(Boolean)
      .map((x) => x.children);

    this.setState({
      options: _.shuffle([...correctAnswers, ...otherOptions]),
      correctAnswers: correctAnswers.map(getText),
      answers: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.card.id !== prevProps.card.id) {
      this.componentDidMount();
    }
  }
  // click = (text) => {
  //   let answers = this.state.answers || []
  //   let index = answers.findIndex(i => !i)
  //   if (index < 0) {
  //     index = answers.length
  //   }
  //   answers.splice(index, 1, text)
  //   answers = answers.slice(0, this.state.correctAnswers.length) // Don't overflow allowed slots
  //   this.setState({ answers })
  //
  //   let allAnswered = true
  //   let correct = true
  //   this.state.correctAnswers.forEach((answer, i) => {
  //     if (answer !== answers[i]) {
  //       correct = false
  //     }
  //     if (!answers[i]) {
  //       allAnswered = false
  //     }
  //   })
  //   if (allAnswered) {
  //     this.props.submitAnswer({
  //       correct,
  //     })
  //   }
  // }
  remove = (index) => {
    // console.warn(index)
    let answers = this.state.answers || [];
    answers[index] = null;
    this.setState({
      answers: answers,
    });
  };
  dropped = (index, text) => {
    let answers = this.state.answers || [];
    answers[index] = text;
    // answers = answers.slice(0, this.state.correctAnswers.length) // Don't overflow allowed slots
    this.setState({ answers });
    // console.log({text,answers})

    let allAnswered = true;
    let correct = true;
    this.state.correctAnswers.forEach((answer, i) => {
      if (answer !== answers[i]) {
        correct = false;
      }
      if (!answers[i]) {
        allAnswered = false;
      }
    });
    if (allAnswered) {
      this.props.submitAnswer({
        correct,
      });
    }
  };
  render() {
    const { card, answer } = this.props;
    const { options, answers } = this.state;
    return (
      <div>
        {/* <div className="top-instructions">Click the missing words in the correct order</div> */}
        <div className="drag-drop-prompt">
          <div className="small gray sans-serif">
            Drag the words into the correct order.
          </div>

          {card.audio && (
            <div className="flex-center">
              <div>{"🔈"}</div>
              <small className="small-instructions center">
                Click to play sound
              </small>
            </div>
          )}

          {card.listen && !answer.answered ? null : (
            <div className="english">"{card.english}"</div>
          )}

          <div className="image">{card.image}</div>

          <div className="flex-center">
            <div>
              {renderDropTarget(card.icelandic, answers, this.remove)}

              {/* {answer.answered && card.icelandic} */}
              {/* {!answer.answered && renderDropTarget(card.icelandic, answers, this.remove)} */}
            </div>
          </div>
        </div>

        <div className="drag-drop-answers">
          <div className="flex-center">
            <div>
              {options &&
                options.map((option, index) => {
                  const text = getText(option);
                  if (answers?.includes(text)) {
                    return null;
                  } else {
                    return (
                      <Draggable
                        key={index}
                        dropped={(index) => this.dropped(index, text)}
                        className="" /*onClick={()=>this.click(text)}*/
                      >
                        {option}
                      </Draggable>
                    );
                  }
                })}
              {answer?.answered && answer.correct && (
                <div className="green">Correct</div>
              )}
              {answer?.answered && !answer.correct && (
                <div>
                  <div>The correct answer is:</div>
                  {card.icelandic}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Element;

/*
  Renders drop targets as blank spaces unless someone has answered it
*/
const renderDropTarget = (children, answers, remove) => {
  let index = 0;
  const Traverse = (input, key = 0) => {
    if (input === null) {
      return;
    } else if (Array.isArray(input)) {
      return input.map((element, index) => Traverse(element, index));
    } else if (typeof input === "object" || typeof input === "function") {
      const name = input.props["data-name"];
      if (name === "drag") {
        let currentIndex = index++;
        if (answers && answers[currentIndex]) {
          const text = getText(input);
          return (
            <span
              key={key}
              className="drag-drop-target-answered"
              onClick={() => remove(currentIndex)}
            >
              {answers[currentIndex]}
            </span>
          );
        } else {
          return (
            <Droppable key={key} currentIndex={currentIndex}>
              <span />
            </Droppable>
          );
        }
      } else {
        return {
          ...input,
          props: {
            ...input.props,
            children: Traverse(input.props.children),
          },
        };
      }
    } else {
      return input;
    }
  };
  return Traverse(children);
};

class Draggable extends Component {
  state = {
    x: 0,
    y: 0,
    animation: false,
  };
  componentDidMount() {
    if (Hammer) {
      this.node = ReactDOM.findDOMNode(this);
      this.hammer = new Hammer.Manager(this.node);
      this.hammer.add(new Hammer.Pan({ threshold: 2 }));
      this.hammer.on("panstart", this.panstart);
      this.hammer.on("panend", this.panend);
      this.hammer.on("panmove", this.panmove);
    }
  }
  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop();
      this.hammer.destroy();
      this.hammer = null;
    }
  }
  resetPosition = () => {
    this.setState({
      x: 0,
      y: 0,
      animation: true,
    });
  };

  panstart = () => {
    this.setState({
      animation: false,
    });
  };

  panmove = (e) => {
    this.setState({
      x: e.deltaX,
      y: e.deltaY,
    });
    const dropTarget = this.getTarget(e);
    $(".dropping").removeClass("dropping");
    if (dropTarget) {
      $(dropTarget).parent().addClass("dropping");
    }
  };

  getTarget = (e) => {
    return document
      .elementFromPoint(e.srcEvent.clientX, e.srcEvent.clientY)
      .closest(".ghost-target");
  };

  panend = (e) => {
    this.setState({
      x: 0,
      y: 0,
      animation: true,
    });
    $(".dropping").removeClass("dropping");
    const dropTarget = this.getTarget(e);
    if (dropTarget) {
      const index = $(dropTarget).parent().attr("data-current-index");
      this.props.dropped(index);
    }
  };

  render() {
    const { x, y, animation } = this.state;
    return (
      <div style={move(x, y, animation)} className="drag-drop-object">
        {this.props.children}
      </div>
    );
  }
}

const move = (x, y, animation) => {
  return {
    transform: `translate(${x}px, ${y}px)`,
    transition: animation ? "all .3s" : "",
    animation: "none",
  };
};

class Droppable extends Component {
  render() {
    return (
      <div
        className="droppable drag-drop-target"
        data-current-index={this.props.currentIndex}
      >
        <div className="ghost-target" />
        {this.props.children}
      </div>
    );
  }
}
