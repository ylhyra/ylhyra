import { c } from "modules/noUndefinedInTemplateLiteral";
import React from "react";
import ReactDOM from "react-dom";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/functions";
import { _Word } from "ylhyra/documents/translationEditor/main/translator/Views/Document/Word";

type Props = {
  text: string;
  setMinWidth: _Word["setMinWidth"];
  show_definition_above?: Boolean;
};
export default class InlineTranslation extends React.PureComponent<Props> {
  timer: NodeJS.Timeout | null = null;
  componentDidMount = () => {
    this.updateWidth();
    /* Update width again in case the document was too slow to render */
    this.timer = setTimeout(() => {
      this.updateWidth();
    }, 1200);
  };
  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.text !== this.props.text) {
      this.updateWidth();
    }
  };
  updateWidth = () => {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (DOMNode && "getBoundingClientRect" in DOMNode) {
      const rectangle = DOMNode.getBoundingClientRect();
      const width = Math.floor(rectangle.width);
      this.props.setMinWidth(width + 10);
    }
  };
  componentWillUnmount = () => {
    this.timer && clearTimeout(this.timer);
  };
  render() {
    return (
      <div
        className={c`inline-translation ${
          this.props.show_definition_above && "show_definition_above"
        }`}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: ItalicsAndBold(this.props.text),
          }}
        />
      </div>
    );
  }
}
