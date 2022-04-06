import React from "react";
import { connect, ConnectedProps } from "react-redux";
import AutosizeTextarea from "react-textarea-autosize";
import { RootState } from "ylhyra/app/app/store";
import { updateSentence } from "ylhyra/content/translationEditor/main/translator/actions";

class SentenceTranslation extends React.Component<
  ConnectedProps<typeof connector>
> {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }
  handleEnter = (e) => {
    if (e.which === 13) {
      e.preventDefault();
    }
  };
  onFocus = () => {
    this.setState({
      focus: true,
    });
  };
  onBlur = () => {
    this.setState({
      focus: false,
    });
  };
  handleChange = (e, fieldName) => {
    this.props.updateSentence({
      sentence_id: this.props.id,
      fieldName: fieldName,
      value: e.target.value,
    });
  };
  shouldComponentUpdate = (nextProps) => {
    const { id } = this.props;
    if (
      this.props.suggestions !== nextProps.suggestions &&
      this.props.suggestions[id] !== nextProps.suggestions[id]
    ) {
      return true;
    }
    if (
      this.props.translation.sentences[id] !==
      nextProps.translation.sentences[id]
    ) {
      return true;
    }
    return false;
  };
  render() {
    const { translation, id, suggestions } = this.props;
    const sentence = translation.sentences[id] || {};

    let placeholder = "";
    if (suggestions && id in suggestions && suggestions[id].length > 0) {
      placeholder = suggestions[id][0].definition.meaning;
    }

    return (
      <div className="sentence">
        <div>
          {/* {!(!this.state.focus && sentence.meaning && !sentence.direct && !sentence.note) && (
            <b>Merking</b>
          )} */}
          <b>Translation</b>
          <AutosizeTextarea
            className="textarea"
            // focus={this.state.focus}
            value={sentence.meaning || ""}
            onKeyPress={this.handleEnter}
            onChange={(e) => this.handleChange(e, "meaning")}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            placeholder={placeholder}
            ref="meaning"
          />
        </div>

        <div
        //className={(this.state.focus || sentence.direct) ? 'visible' : 'hidden'}
        >
          <b>Direct translation</b>
          <AutosizeTextarea
            className="textarea"
            // isFocused={this.state.focus}
            value={sentence.direct || ""}
            onKeyPress={this.handleEnter}
            onChange={(e) => this.handleChange(e, "direct")}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref="direct"
          />
        </div>

        <div
        //className={(this.state.focus || sentence.note) ? 'visible' : 'hidden'}
        >
          <b>Note</b>
          <AutosizeTextarea
            className="textarea"
            // focus={this.state.focus}
            onKeyPress={this.handleEnter}
            value={sentence.note || ""}
            onChange={(e) => this.handleChange(e, "note")}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref="note"
          />
        </div>
        {/* <div>
          <label>
            <input type="checkbox"/> <small>
              Join to previous sentence
            </small>
          </label>
        </div> */}
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    translation: state.editor.translation,
    suggestions: state.editor.suggestions,
  }),
  { updateSentence }
);
export default connector(SentenceTranslation);
