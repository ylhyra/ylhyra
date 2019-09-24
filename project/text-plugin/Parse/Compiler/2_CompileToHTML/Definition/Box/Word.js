import React from 'react'
import exists from 'App/functions/exists'
import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'

export default class WordBox extends React.PureComponent {
  render() {
    const { definition } = this.props;
    if (!exists(definition) ||
      (!definition.base &&
        !definition.base_meaning &&
        !definition.base_direct &&
        !definition.direct &&
        !definition.meaning
        // &&
        // !definition.meaning
      )) return null
    // console.log(definition)
    return (
      <span className="word-box" data-box-id={this.props.id}>
        <span>
          {definition.base && definition.base.trim() &&
            <span className="base">
              <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.base)}}/>
            </span>
          }
          {definition.base_meaning && definition.base_meaning.trim() &&
            <span className="base_meaning">
              <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.base_meaning)}}/>
            </span>
          }
          {definition.base_direct && definition.base_direct.trim() &&
            <span className="base_direct">
              {/* <label>Literally</label> */}
              “<span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.base_direct)}}/>”
            </span>
          }

          {definition.direct && definition.direct.trim() &&
            <span className="">
              <label>Literally</label>
              “<span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.direct)}}/>”
            </span>
          }

          {definition.note && definition.note.trim() &&
            <span className="small">
              <label>Note</label>
              <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(definition.note)}}/>
            </span>
          }
        </span>
        {definition.sound && definition.sound.length > 0 &&
          <span>🔈</span>
        }
        {definition.pronunciation &&
          <span className="small">
            <label>Pronunciation</label>
            <span className="pronunciation" dangerouslySetInnerHTML={{__html: definition.pronunciation}}/>
          </span>
        }
      </span>
    )
  }
}
