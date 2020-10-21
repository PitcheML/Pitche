/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as faceapi from 'face-api.js'
import {setEmotionsInDb} from '../store/emotion'
import Countdown from 'react-countdown'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import StopIcon from '@material-ui/icons/Stop'
import {LinearProgress, Paper} from '@material-ui/core'

const emotions = {
  sad: 0,
  angry: 0,
  neutral: 0,
  surprised: 0,
  happy: 0,
  disgusted: 0,
  fearful: 0
}

let videostream
let audiostream
let outputResult = ''

const Completion = ({stopVideo, self}) => {
  stopVideo()
  self.props.history.push('/results')
  return <button type="submit">See Results</button>
}

class VideoFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInitialized: false,
      isRecording: false,
      isProcessing: false,
      isListening: false,
      recordingTime: 30000
    }
    this.stopVideo = this.stopVideo.bind(this)
    this.onVideoPlay = this.onVideoPlay.bind(this)
    this.setRecordingTime = this.setRecordingTime.bind(this)
    this.stopVideoEarly = this.stopVideoEarly.bind(this)
  }

  async componentDidMount() {
    const MODELS = '/models'
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODELS),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS),
      faceapi.nets.faceExpressionNet.loadFromUri(MODELS),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS)
    ]).then(this.startVideo)
  }

  componentWillUnmount() {
    if (videostream) {
      videostream.getTracks()[0].stop()
    }
    videostream = null
    try {
      audiostream.stop()
      this.setState({isListening: false})
    } catch (e) {
      console.log('')
    }
  }

  setRecordingTime(evt, type = 'seconds') {
    evt.preventDefault()
    if (type === 'minutes') {
      let newVideoTime = evt.target.value
      newVideoTime = newVideoTime * 60 * 1000
      let seconds = document.getElementsByClassName(
        'recording__time__seconds'
      )[0].value
      seconds *= 1000
      newVideoTime += seconds
      this.setState({
        recordingTime: newVideoTime
      })
    } else {
      let newVideoTime = evt.target.value
      newVideoTime *= 1000

      let minutes = document.getElementsByClassName(
        'recording__time__minutes'
      )[0].value
      minutes = minutes * 60 * 1000
      newVideoTime += minutes

      console.log('newvideotime =====> ', newVideoTime)

      this.setState({
        recordingTime: newVideoTime
      })
    }
  }

  handleListen = () => {
    const {isListening} = this.state
    let outputTranscript
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const mic = new SpeechRecognition()
    audiostream = mic

    mic.continuous = true
    mic.interimResults = true
    mic.lang = 'en-US'

    if (isListening) {
      mic.start()
      // mic.onend = () => {
      //   mic.start()
      // }
    } else {
      mic.stop()
      // mic.onend = () => {
      //   console.log('Mic Stop')
      // }
    }
    mic.onstart = () => {
      console.log('Mic Start')
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      outputTranscript = transcript
      outputResult = transcript
      mic.onerror = event => {
        console.log(event.error)
      }
    }
    mic.onend = () => {
      console.log('Mic Stop')
    }
    this.setState({isListening: false})
  }

  startProcessing = () => {
    this.setState({isProcessing: true})
    this.handleListen()
  }

  stopVideoEarly = () => {
    const dontSave = 'dontSave'
    this.stopVideo(dontSave)
    this.props.history.push('/home')
  }

  startVideo = () => {
    this.setState({isInitialized: true, isListening: true})
    navigator.getUserMedia(
      {
        video: true
      },
      stream => {
        let video = document.getElementsByClassName('videoFeed__video')[0]
        if (video) {
          video.srcObject = stream
          videostream = stream
        }
      },
      err => console.error(err)
    )
    console.log('video has loaded....')
  }

  stopVideo = (dontSave = null) => {
    audiostream.stop()
    if (videostream) {
      videostream.getTracks()[0].stop()
    }
    videostream = null
    const totalEmotions = Object.values(emotions).reduce(
      (accum, curElm) => accum + curElm,
      0
    )

    const emotionsPercentage = {
      sad: emotions.sad / totalEmotions,
      angry: emotions.angry / totalEmotions,
      neutral: emotions.neutral / totalEmotions,
      surprised: emotions.surprised / totalEmotions,
      happy: emotions.happy / totalEmotions,
      disgusted: emotions.disgusted / totalEmotions,
      fearful: emotions.fearful / totalEmotions,
      transcript: outputResult,
      duration: this.state.recordingTime
    }

    if (!dontSave) {
      this.props.setEmotion(emotionsPercentage)
    }

    this.setState({
      isInitialized: false,
      isRecording: false,
      isProcessing: false,
      isListening: false
    })
  }

  onVideoPlay() {
    let self = this
    let count = 0
    const dataTimer = 100
    let interval = setInterval(async function() {
      if (videostream) {
        if (videostream.active === true) {
          const input = document.getElementsByClassName('videoFeed__video')[0]
          const results = await faceapi
            .detectSingleFace(input)
            .withFaceLandmarks()
            .withFaceExpressions()
          count++
          if (count === 5) {
            self.setState({isRecording: true})
          }
          if (self.state.isRecording) {
            if (results) {
              const emotionalResults = Object.keys(results.expressions).reduce(
                (a, b) =>
                  results.expressions[a] > results.expressions[b] ? a : b
              )
              emotions[emotionalResults]++
            }
          }
        }
      } else {
        clearInterval(interval)
      }
    }, dataTimer)
  }

  render() {
    const {isInitialized, isRecording, isProcessing} = this.state
    const VIDEO_HEIGHT = 480
    const VIDEO_WIDTH = 640

    return (
      <>
        <div className="video">
          <div className="video__left">
            {isInitialized && isRecording === false ? (
              <div className="video__loading" />
            ) : null}
            {isProcessing ? (
              <div className="timer-container">
                <h5>Time Remaining:</h5>
                <Countdown
                  id="countdown-timer"
                  date={Date.now() + this.state.recordingTime}
                  daysInHours={true}
                >
                  <Completion stopVideo={this.stopVideo} self={this} />
                </Countdown>
              </div>
            ) : null}
          </div>
          <div className="video__right">
            {isProcessing ? (
              <h4>
                REC <button type="button" className="rec" />
              </h4>
            ) : null}
            <div className="video__container">
              <video
                className="videoFeed__video"
                autoPlay
                muted
                height={VIDEO_HEIGHT}
                width={VIDEO_WIDTH}
                onPlay={this.onVideoPlay}
              />
            </div>
          </div>
          <div
            className={
              isInitialized === true && isRecording === true
                ? 'video__bottom'
                : 'video__bottom__hidden'
            }
          >
            {isProcessing ? (
              <div>
                <button
                  id="record-stop-btn"
                  type="button"
                  onClick={this.stopVideoEarly}
                >
                  Stop Recording <StopIcon />
                </button>
              </div>
            ) : null}
            {isInitialized && isRecording ? (
              <>
                {isProcessing ? null : (
                  <>
                    <button
                      type="button"
                      onClick={this.startProcessing}
                      disabled={
                        !(isInitialized === true && isRecording === true)
                      }
                    >
                      Start Recording <VideoCallIcon />
                    </button>
                    <div className="recording__time__input">
                      <Paper elevation={4} id="recording__time__box">
                        <h4 className="recording__header">
                          Enter Desired Recording Time
                        </h4>

                        <div className="recording__input__fields">
                          <input
                            type="number"
                            onChange={e => this.setRecordingTime(e, 'minutes')}
                            min="0"
                            max="99"
                            placeholder="0"
                            className="recording__time__minutes"
                            defaultValue="0"
                          />
                          <label>Min</label>
                          <input
                            type="number"
                            onChange={this.setRecordingTime}
                            min="0"
                            max="59"
                            className="recording__time__seconds"
                            defaultValue={this.state.recordingTime / 1000}
                          />
                          <label>Sec</label>
                        </div>
                      </Paper>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="video__loading__div">
                {isInitialized === false && isRecording === false ? (
                  <h4>Webcam Loading...</h4>
                ) : (
                  <h4>Loading up models....</h4>
                )}

                <LinearProgress />
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}
const mapState = () => {
  return {}
}

const mapDispatchToState = dispatch => {
  return {setEmotion: emotionObj => dispatch(setEmotionsInDb(emotionObj))}
}

export default connect(mapState, mapDispatchToState)(VideoFeed)
