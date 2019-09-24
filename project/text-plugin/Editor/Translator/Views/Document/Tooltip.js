import React from 'react'
import styled from 'styled-components'

const border_color = '#BFBFBF'
const arrow_size = 4

const WordWrapper = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  width: 240px;
  height: 100px;
  bottom: 22px;
  margin-left: -${240/2}px;
  left: 50%;
  flex-direction: column;
  position: absolute;
`
const Flex = styled.div`
  flex: 1;
`
const Element = styled.div`
  z-index: 100;
  margin: auto;
  display: inline-block;

  background: #FFFFFF;
  border: 1px solid ${border_color};
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.07), 0 2px 3px 0 rgba(0,0,0,0.06);
  border-radius: 3px;

  font-size: 13px;
  line-height: 1.4em;

  .kafli {
    padding: 4px 7px;
    &:not(:last-child) {
      border-bottom: 1px solid ${border_color};
    }
    &.gray {
      background: #eee;
    }
    &.meaning {
      font-size: 14px;
    }
    div {
      font-weight: bold;
    }
    label {
      font-size: 11px;
      color: #7a7a7a;
      text-transform: uppercase;
    }
  }
`


/*    _       __               __
     | |     / /___  _________/ /
     | | /| / / __ \/ ___/ __  /
     | |/ |/ / /_/ / /  / /_/ /
     |__/|__/\____/_/   \__,_/   */

export class wordTooltip extends React.PureComponent {
  render() {
    const { definition } = this.props

    const arrowColor = (definition.direct || definition.orð_í_grunnútgáfu || definition.dæmi_um_setningu)
    return (
      <WordWrapper visible={this.props.visible}>
        <Flex></Flex>
        <Element>
          {definition.meaning &&
            <div className="kafli meaning">
              <div>{definition.meaning}</div>
            </div>
          }

          {definition.direct &&
            <div className="kafli gray">
              <label>Direct translation</label>
              <div>{definition.direct}</div>
            </div>
          }
          {definition.orð_í_grunnútgáfu &&
            <div className="kafli gray">
              <label>Word in base position (?)</label>
              <div>{definition.orð_í_grunnútgáfu}</div>
            </div>
          }
          {definition.dæmi_um_setningu &&
            <div className="kafli gray">
              <label>Example usage</label>
              <div>{definition.dæmi_um_setningu}</div>
            </div>
          }
        </Element>
      </WordWrapper>
    )
  }
}
