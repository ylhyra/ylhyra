import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'

class Answers extends React.PureComponent {
  state = {}
  render() {
    const { options, answer } = this.props
    if(!options || !options.children) return null;
    // console.log(options)
    return (
      <div className="answers-container">
        {options.instructions && <div className="instructions">{options.instructions}</div>}
        <div className="answers horizontal">
          {options.children.map((answer,index)=> {

            const className = [
              'button-answer',
              'horizontal',
              answer.answered && 'answered',
              answer.selected_index === index && 'selected',
              answer.answered && options.correctIndex === index ? 'correct' : 'incorrect'
            ].filter(Boolean).join(' ')

            return (
              <div className={className} key={index} onClick={()=>{
                if(this.props.answered) return;
                this.props.submitAnswer({
                  index,
                })
              }}>
                {answer}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
export default Answers
