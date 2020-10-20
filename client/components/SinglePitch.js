import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPitch} from '../store/singlePitch'
import Paper from '@material-ui/core/Paper'
import TwoLevelPieChart from './TwoLevelPieChart'
import {deleteEmotionFromDB} from '../store/emotion'

class SinglePitch extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  async componentDidMount() {
    await this.props.getPitch(this.props.match.params.pitchId)
  }

  handleClick() {
    console.log(this.props)
    this.props.deleteEmotion(this.props.pitch.id)
    this.props.history.push('/history')
  }

  getData() {
    const {pitch} = this.props

    const data = [
      {name: 'Angry', value: pitch.angry},
      {name: 'Disgusted', value: pitch.disgusted},
      {name: 'Fearful', value: pitch.fearful},
      {name: 'Happy', value: pitch.happy},
      {name: 'Neutral', value: pitch.neutral},
      {name: 'Sad', value: pitch.sad},
      {name: 'Surprised', value: pitch.surprised}
    ]

    return data
  }
  render() {
    const {pitch} = this.props
    let rawTranscript, splitTranscript, mostUsedWord, mostUsedCount, allMetrics
    if (this.props.pitch.id) {
      rawTranscript = pitch.transcript
      splitTranscript = rawTranscript.split(' ')
      allMetrics = splitTranscript.reduce((accum, currentElem) => {
        if (currentElem === 'like' || currentElem === 'bike') {
          if (accum.like) accum.like++
          else {
            accum.like = 1
          }
        }
        if (
          currentElem === 'yeah' ||
          currentElem === 'yea' ||
          currentElem === 'ya'
        ) {
          if (accum.yeah) accum.yeah++
          else {
            accum.yeah = 1
          }
        }
        if (currentElem === 'hey' || currentElem === 'hay') {
          if (accum.hey) accum.hey++
          else {
            accum.hey = 1
          }
        }
        if (currentElem === 'ok' || currentElem === 'okay') {
          if (accum.ok) accum.ok++
          else {
            accum.ok = 1
          }
        }
        if (currentElem === 'so') {
          if (accum.so) accum.so++
          else {
            accum.so = 1
          }
        }
        return accum
      }, {})
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
        {this.props.pitch.id ? (
          <React.Fragment>
            <Paper elevation={4}>
              <div className="results__container">
                <div className="results__container__left">
                  <h2>Your Emotional State:</h2>
                  <div className="results__container__chart">
                    <TwoLevelPieChart data={this.getData()} />
                  </div>
                </div>
                <div className="results__container__right">
                  <Paper elevation={4}>
                    <div className="results__container__right__left">
                      <h2>Your Transcript:</h2>
                      <p>"{rawTranscript}"</p>
                    </div>
                    <div className="results__container__right__right">
                      <div className="results__container__right__top">
                        <Paper elevation={4}>
                          <h2>Speech Results:</h2>
                          <span>
                            <p>Word Count: {splitTranscript.length} words</p>
                          </span>
                          <span>
                            <p>
                              Vocal Speed:{' '}
                              {(splitTranscript.length / 30).toFixed(2)}{' '}
                              words/second
                            </p>
                          </span>
                          <span>
                            <p>
                              Most Frequently Used Word: "{mostUsedWord}" (used{' '}
                              {mostUsedCount} times)
                            </p>
                          </span>
                        </Paper>
                      </div>

                      <div className="results__container__right__bottom">
                        <Paper elevation={4}>
                          <h2>Filler Word Analysis:</h2>
                          <p>
                            "Like" Counter:{' '}
                            {allMetrics.like ? allMetrics.like : 'None'}
                          </p>
                          <p>
                            "Yeah" Counter:{' '}
                            {allMetrics.yeah ? allMetrics.like : 'None'}
                          </p>
                          <p>
                            "Ok/Okay" Counter:{' '}
                            {allMetrics.ok ? allMetrics.like : 'None'}
                          </p>
                          <p>
                            "So" Counter:{' '}
                            {allMetrics.so ? allMetrics.like : 'None'}
                          </p>
                          <p>
                            "Hey" Counter:{' '}
                            {allMetrics.hey ? allMetrics.like : 'None'}
                          </p>
                        </Paper>
                      </div>
                    </div>
                  </Paper>
                </div>
              </div>
            </Paper>
            <button type="submit" onClick={this.handleClick}>
              Delete this Pitch and Record Again
            </button>
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
    pitch: state.singlePitch
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPitch: pitchId => dispatch(fetchPitch(pitchId)),
    deleteEmotion: emotionId => dispatch(deleteEmotionFromDB(emotionId))
  }
}

export default connect(mapState, mapDispatchToProps)(SinglePitch)
