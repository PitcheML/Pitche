import React, {Component} from 'react'
import {connect} from 'react-redux'

class Results extends Component {
  render() {
    console.log('this is our props -->', this.props)
    const emotions = this.props.emotion
    const mostRecentEmotionalAnalysis = emotions[emotions.length - 1]
    return (
      <div>
        <h1>Results:</h1>
        {emotions ? (
          <div>
            <h2>Sad: {(mostRecentEmotionalAnalysis.sad * 100).toFixed(2)}%</h2>
            <h2>
              Angry: {(mostRecentEmotionalAnalysis.angry * 100).toFixed(2)}%
            </h2>
            <h2>
              Neutral: {(mostRecentEmotionalAnalysis.neutral * 100).toFixed(2)}%
            </h2>
            <h2>
              Surprised:{' '}
              {(mostRecentEmotionalAnalysis.surprised * 100).toFixed(2)}%
            </h2>
            <h2>
              Happy: {(mostRecentEmotionalAnalysis.happy * 100).toFixed(2)}%
            </h2>
            <h2>
              Disgusted:{' '}
              {(mostRecentEmotionalAnalysis.disgusted * 100).toFixed(2)}%
            </h2>
            <h2>
              Fearful: {(mostRecentEmotionalAnalysis.fearful * 100).toFixed(2)}%
            </h2>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapState = state => {
  return {
    emotion: state.emotion
  }
}

export default connect(mapState)(Results)
