import React from "react";
import ReactDOM from "react-dom";
// import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'

class InlineTranslation extends React.PureComponent {
  timer = null;
  componentDidMount = () => {
    this.updateWidth();
    /* Update width again in case the document was too slow to render */
    this.timer = setTimeout(() => {
      this.updateWidth();
    }, 1200);
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.text !== this.props.text) {
      this.updateWidth();
    }
  };
  updateWidth = () => {
    const DOMNode = ReactDOM.findDOMNode(this);
    const rectangle = DOMNode.getBoundingClientRect();
    const width = Math.floor(rectangle.width);
    this.props.setMinWidth(width + 10);
    // console.log({width,text:this.props.text})
  };
  componentWillUnmount = () => {
    this.timer && clearTimeout(this.timer);
  };
  render() {
    return (
      <div className="inline-translation">
        <span
          dangerouslySetInnerHTML={{ __html: ItalicsAndBold(this.props.text) }}
        />
      </div>
    );
  }
}

export default InlineTranslation;

export const ItalicsAndBold = (input) => {
  return input
    .replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>")
    .replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>")
    .replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
};
