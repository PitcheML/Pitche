import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchEmotions} from '../store/emotion'

class History extends Component {
  componentDidMount() {
    this.props.getEmotions()
  }
  render() {
    console.log('this is our props -->', this.props)
    const emotions = this.props.emotion

    return (
      <div>
        {emotions.length > 0 ? (
          emotions.map(emotion => {
            return (
              <React.Fragment key={emotion.id}>
                <h1>Results:</h1>
                <div>
                  <h2>Sad: {(emotion.sad * 100).toFixed(2)}%</h2>
                  <h2>Angry: {(emotion.angry * 100).toFixed(2)}%</h2>
                  <h2>Neutral: {(emotion.neutral * 100).toFixed(2)}%</h2>
                  <h2>Surprised: {(emotion.surprised * 100).toFixed(2)}%</h2>
                  <h2>Happy: {(emotion.happy * 100).toFixed(2)}%</h2>
                  <h2>Disgusted: {(emotion.disgusted * 100).toFixed(2)}%</h2>
                  <h2>Fearful: {(emotion.fearful * 100).toFixed(2)}%</h2>
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <h4>None</h4>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    emotion: state.emotion
  }
}

const mapDispatchToState = dispatch => {
  return {getEmotions: () => dispatch(fetchEmotions())}
}

export default connect(mapState, mapDispatchToState)(History)
