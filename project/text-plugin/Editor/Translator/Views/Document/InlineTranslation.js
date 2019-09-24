import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
// import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'

class InlineTranslation extends React.PureComponent {
  componentDidMount = () => {
    const DOMNode = ReactDOM.findDOMNode(this)
    const rectangle = DOMNode.getBoundingClientRect();
    const width = Math.floor(rectangle.width)
    this.props.setMinWidth(width + 10)
  }
  componentDidUpdate = (prevProps) => {
    if(prevProps.text !== this.props.text) {
      this.componentDidMount()
    }
  }
  render() {
    return (
      <div className="inline-translation">
        <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(this.props.text)}}/>
      </div>
    )
  }
}

export default InlineTranslation

export const ItalicsAndBold = (input) => {
  return input
    .replace(/\*\*([^ ].+?[^ ])\*\*/g, '<b>$1</b>')
    .replace(/\*([^ ].+?[^ ])\*/g, '<i>$1</i>')
    .replace(/_([^ ].+?[^ ])_/g, '<i>$1</i>')
}
