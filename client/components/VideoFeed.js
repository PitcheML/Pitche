import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as faceapi from 'face-api.js'
import {setEmotionsInDb} from '../store/emotion'
import Countdown from 'react-countdown'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import CircularProgress from '@material-ui/core/CircularProgress'
import {LinearProgress} from '@material-ui/core'

let videostream
const emotions = {
  sad: 0,
  angry: 0,
  neutral: 0,
  surprised: 0,
  happy: 0,
  disgusted: 0,
  fearful: 0
}

const dataTimer = 100
const totalVideoTime = 30000

let audiostream
let output_result = ''

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
      emotionSet: false
    }
    this.stopVideo = this.stopVideo.bind(this)
    this.onVideoPlay = this.onVideoPlay.bind(this)
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

  handleListen = () => {
    const {isListening} = this.state

    let output_transcript

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const mic = new SpeechRecognition()
    audiostream = mic

    mic.continuous = true
    mic.interimResults = true
    mic.lang = 'en-US'

    if (isListening) {
      mic.start()
      mic.onend = () => {
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      output_transcript = transcript
      output_result = transcript
      mic.onerror = event => {
        console.log(event.error)
      }
    }
    mic.onend = () => {
      console.log('Mic Stop')
      console.log('returning ----> ', output_transcript)
    }
    this.setState({isListening: false})
  }

  startProcessing = () => {
    console.log('start processinggg...')
    this.setState({isProcessing: true})
    this.handleListen()
  }

  startVideo = () => {
    this.setState({isInitialized: true, isListening: true})
    console.log('video starting up....')
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

  stopVideo = () => {
    console.log('attempting stop')
    audiostream.stop()
    if (videostream) {
      videostream.getTracks()[0].stop()
    }
    videostream = null
    console.log('emotional breakdown', emotions)
    const totalEmotions = Object.values(emotions).reduce(
      (accum, curElm) => accum + curElm,
      0
    )

    console.log('this is the results ---->', output_result)
    const emotionsPercentage = {
      sad: emotions.sad / totalEmotions,
      angry: emotions.angry / totalEmotions,
      neutral: emotions.neutral / totalEmotions,
      surprised: emotions.surprised / totalEmotions,
      happy: emotions.happy / totalEmotions,
      disgusted: emotions.disgusted / totalEmotions,
      fearful: emotions.fearful / totalEmotions,
      transcript: output_result
    }
    console.log('emotion percentage', emotionsPercentage)
    console.log('emotion set?', this.state)

    this.props.setEmotion(emotionsPercentage)

    console.log('this is the state --->', this.state)
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
    let interval = setInterval(async function() {
      if (videostream) {
        // console.log('running analysis')
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
        // console.log(self.state)
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
              <h4 className="video__loading" />
            ) : null}
            {isProcessing ? (
              <Countdown date={Date.now() + totalVideoTime} daysInHours={true}>
                <Completion stopVideo={this.stopVideo} self={this} />
              </Countdown>
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
            {isInitialized && isRecording ? (
              <button
                type="button"
                onClick={this.startProcessing}
                disabled={!(isInitialized === true && isRecording === true)}
              >
                Start Processing <VideoCallIcon />
              </button>
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
