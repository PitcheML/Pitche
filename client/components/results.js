import React, {Component, Table} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie, donut, radar} from 'billboard.js'
import {fetchEmotions} from '../store/emotion'
import Paper from '@material-ui/core/Paper'
import TwoLevelPieChart from './TwoLevelPieChart'

class Results extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
  }
  async componentDidMount() {
    await this.props.getEmotions()
  }

  getData() {
    const emotions = this.props.emotion
    const recentResult = emotions[emotions.length - 1]
    const data = [
      {name: 'Angry', value: recentResult.angry},
      {name: 'Disgusted', value: recentResult.disgusted},
      {name: 'Fearful', value: recentResult.fearful},
      {name: 'Happy', value: recentResult.happy},
      {name: 'Neutral', value: recentResult.neutral},
      {name: 'Sad', value: recentResult.sad},
      {name: 'Surprised', value: recentResult.surprised}
    ]

    return data
  }

  render() {
    const emotions = this.props.emotion
    let rawTranscript,
      splitTranscript,
      likeCounter,
      umCounter,
      uhCounter,
      okayCounter,
      soCounter,
      mostUsedWord,
      mostUsedCount
    if (emotions.length > 0) {
      rawTranscript = emotions[emotions.length - 1].transcript
      splitTranscript = rawTranscript.split(' ')
      likeCounter = splitTranscript.reduce((accum, currentElem) => {
        if (currentElem === 'like' || currentElem === 'bike') {
          accum++
        }
        return accum
      }, 0)
      umCounter = splitTranscript.reduce((accum, currentElem) => {
        if (
          currentElem === 'um' ||
          currentElem === 'umm' ||
          currentElem === 'uhm' ||
          currentElem === 'hmm'
        ) {
          accum++
        }
        return accum
      }, 0)
      uhCounter = splitTranscript.reduce((accum, currentElem) => {
        if (
          currentElem === 'uh' ||
          currentElem === 'uhh' ||
          currentElem === 'ah' ||
          currentElem === 'er'
        ) {
          accum++
        }
        return accum
      }, 0)
      okayCounter = splitTranscript.reduce((accum, currentElem) => {
        if (currentElem === 'ok' || currentElem === 'okay') {
          accum++
        }
        return accum
      }, 0)
      soCounter = splitTranscript.reduce((accum, currentElem) => {
        if (currentElem === 'so') {
          accum++
        }
        return accum
      }, 0)
      let mostUsedObj = splitTranscript.reduce((accum, currentElem) => {
        if (accum[currentElem]) {
          accum[currentElem]++
        } else {
          accum[currentElem] = 1
        }
        return accum
      }, {})
      mostUsedWord = Object.keys(mostUsedObj).reduce((accum, currentElem) => {
        return mostUsedObj[accum] > mostUsedObj[currentElem]
          ? accum
          : currentElem
      })
      mostUsedCount = Object.values(mostUsedObj).reduce(
        (accum, currentElem) => {
          return accum > currentElem ? accum : currentElem
        }
      )
    }
    return (
      <div className="results">
        {this.props.emotion.length > 0 ? (
          <React.Fragment>
            <h1>Speech Results</h1>
            <p>Word Count:</p>
            <p>{splitTranscript.length} words</p>
            <p>Vocal Speed:</p>
            <p>{splitTranscript.length / 10} words/second</p>
            <p>Most Frequently Used Word:</p>
            <p>
              "{mostUsedWord}" (used {mostUsedCount} times)
            </p>
            <h2>Your Emotional State:</h2>
            <TwoLevelPieChart data={this.getData()} />
            <h2>Your Transcript:</h2>
            <p>"{rawTranscript}"</p>
            <h2>Filler Word Analysis:</h2>
            <p>"Like" Counter: {likeCounter}</p>
            <p>"Um" Counter: {umCounter}</p>
            <p>"Uh/Ah" Counter: {uhCounter}</p>
            <p>"Ok/Okay" Counter: {okayCounter}</p>
            <p>"So" Counter: {soCounter}</p>
          </React.Fragment>
        ) : (
          <h4>none</h4>
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

const mapDispatchToProps = dispatch => {
  return {
    getEmotions: () => dispatch(fetchEmotions())
  }
}

export default connect(mapState, mapDispatchToProps)(Results)
