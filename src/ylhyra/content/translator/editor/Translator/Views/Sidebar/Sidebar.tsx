import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import {
  clearSelection,
  nextWord,
  updateDefinitionValue,
  wordsHash,
} from "ylhyra/content/translator/editor/Translator/actions";
import Field from "ylhyra/content/translator/editor/Translator/Views/Sidebar/Field";

// import { getLanguage } from 'server/datasets/languages'

class WordSidebar extends React.Component<ConnectedProps<typeof connector>> {
  state = {};
  focus = () => {
    window.setTimeout(() => {
      const element = document.getElementById("meaning");
      element?.focus();
      // element?.select();
    }, 0);
  };

  componentDidMount() {
    window.addEventListener("keydown", this.checkKey);
    this.focus();
    // this.analysis()
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
  }

  checkKey = (e: KeyboardEvent) => {
    // Cmd + D
    if ((e.metaKey || e.ctrlKey) && e.key === "d") {
      (document.querySelector('[name="difficult"]') as HTMLElement).click();
      e.preventDefault();
    }
    // Cmd + I
    else if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      (
        document.querySelector('[name="show_definition_above"]') as HTMLElement
      ).click();
      e.preventDefault();
    }
    // Escape
    else if (e.keyCode === 27) {
      this.props.clearSelection();
    }
    // Enter
    else if (e.keyCode === 13) {
      if (e.altKey) {
        this.props.nextWord("previous", e.shiftKey);
      } else {
        this.props.nextWord("next", e.shiftKey);
      }
    }
  };

  componentDidUpdate = (prevProps: ConnectedProps<typeof connector>) => {
    if (prevProps.selected !== this.props.selected) {
      this.focus();
      // this.analysis()
    }
  };

  render() {
    const { selected, translation } = this.props;
    // const { chosen_words } = this.state
    const definition = translation.definitions[wordsHash(selected)] || {};
    return [
      // <div className="form" style={{display: 'flex', flexDirection: 'column', minHeight: '100%'}}>
      /*
         _____ _     _                              _
        |_   _| |__ (_)___   __      _____  _ __ __| |
          | | | '_ \| / __|  \ \ /\ / / _ \| '__/ _` |
          | | | | | | \__ \   \ V  V / (_) | | | (_| |
          |_| |_| |_|_|___/    \_/\_/ \___/|_|  \__,_|
      */
      <section key="1">
        <label>
          <Field name="difficult" component="input" type="checkbox" /> Difficult
          word (make gray) <kbd>{isMacintosh() ? "Cmd" : "Ctrl"}+D</kbd>
        </label>
        <label>
          <Field
            name="show_definition_above"
            component="input"
            type="checkbox"
          />{" "}
          Show inline translation <kbd>{isMacintosh() ? "Cmd" : "Ctrl"}+I</kbd>
        </label>
        {definition.show_definition_above && (
          <label>
            <b>Translation to be shown:</b>
            <Field
              name="inline_translation"
              component="input"
              type="text"
              placeholder={definition.meaning}
            />
          </label>
        )}
        {/* <label>
          <Field name="hide_pronunciation" component="input" type="checkbox"
          /> Sleppa framburðarlýsingu
        </label> */}
      </section>,

      <section style={{ flex: 1 }} key="2">
        <label>
          <b>Meaning</b>
          <Field name="meaning" component="input" type="text" id="meaning" />
        </label>
        <label>
          <b>Direct translation</b>
          <Field name="direct" component="input" type="text" />
        </label>
        <label>
          <b>Note</b>
          <Field name="note" component="input" type="text" />
        </label>
      </section>,

      /*
        ____                                          _
       | __ )  __ _ ___  ___   __      _____  _ __ __| |
       |  _ \ / _` / __|/ _ \  \ \ /\ / / _ \| '__/ _` |
       | |_) | (_| \__ \  __/   \ V  V / (_) | | | (_| |
       |____/ \__,_|___/\___|    \_/\_/ \___/|_|  \__,_|
      */
      <section className="gray" key="3">
        <h3>Base word</h3>
        <label>
          <b>Base word</b>
          <Field
            name="base"
            component="input"
            type="text" /*placeholder={chosen_words}*/
          />
        </label>
        <label>
          <b>Meaning</b>
          <Field
            name="base_meaning"
            component="input"
            type="text"
            placeholder={definition.meaning}
          />
        </label>
        <label>
          <b>Direct translation</b>
          <Field
            name="base_direct"
            component="input"
            type="text"
            placeholder={definition.direct}
          />
        </label>
        <label>
          <b>Note</b>
          <Field name="base_note" component="input" type="text" />
        </label>
        <label>
          <b>Grammatical analysis</b>
          <Field
            name="grammatical_analysis"
            component="input"
            type="text"
            placeholder={definition.grammatical_analysis}
          />
        </label>
      </section>,
    ];
  }
}

const connector = connect(
  (state: RootState) => ({
    editor: state.editor,
    translation: state.editor.translation,
    selected: state.editor.selected,
    metadata: state.editor.metadata,
    // analysis: state.translatorSelection.analysis,
    // beygingar: state.translatorSelection.beygingar,
    // beygingarRaw: state.translatorSelection.beygingarRaw,
  }),
  {
    clearSelection,
    nextWord,
    updateDefinitionValue,
  }
);
export default connector(WordSidebar);

export const isMacintosh = () => navigator.platform.indexOf("Mac") > -1;
