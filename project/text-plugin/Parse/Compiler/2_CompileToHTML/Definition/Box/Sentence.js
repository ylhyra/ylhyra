import React from 'react'
import exists from 'App/functions/exists'
import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'

export default class SentenceBox extends React.PureComponent {
  render() {
    const { definition } = this.props;
    if (!exists(definition) || !(definition.meaning || definition.direct || definition.note)) return null
    return [
      <span className="box" id={`${this.props.id}-box`} data-ignore="true" data-not-text="true" key={1}>
        {definition.meaning &&
          <span className="meaning">
            <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.meaning)}}/>
          </span>
        }
        {definition.direct &&
          <span className="direct">
            {/* <label>Literally</label> */}
            “<span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.direct)}}/>”
          </span>
        }
        {definition.note &&
          <span className="note small">
            <label>Note</label>
            <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.note)}}/>
          </span>
        }
      </span>,
      <span className="sentence-overlay" id={`${this.props.id}-sentence-overlay`} data-ignore="true" key={2}></span>,
    ]
  }
}
