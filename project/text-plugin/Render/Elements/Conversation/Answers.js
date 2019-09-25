import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'

@connect(state => ({
  conversations: state.conversations,
}))
class Answers extends React.PureComponent {
  state = {}
  render() {
    const { element } = this.props
    if(!element || !element.answers) return null;
    // console.log(element)
    return (
      <div className="answers-container">
        {element.instructions && <div className="instructions">{element.instructions}</div>}
        <div className="answers horizontal">
          {element.answers.map((answer,index)=> {

            const className = [
              'button-answer',
              'horizontal',
              this.state.answered && 'answered',
              this.state.selected_index === index && 'selected',
              this.state.answered && element.correctIndex === index ? 'correct' : 'incorrect'
            ].filter(Boolean).join(' ')

            return (
              <div className={className} key={index} onClick={()=>{
                if(this.state.answered) return;
                this.setState({
                  answered: true,
                  selected_index: index,
                })
                this.props.submit()
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
