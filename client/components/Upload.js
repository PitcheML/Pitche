import React from 'react'
import {connect} from 'react-redux'
import * as faceapi from 'face-api.js'
import {setEmotionsInDb} from '../store/emotion'

let videostream
let audiostream
let outputResult = ''
let URL = window.URL || window.webkitURL
let running = false

const emotions = {
  sad: 0,
  angry: 0,
  neutral: 0,
  surprised: 0,
  happy: 0,
  disgusted: 0,
  fearful: 0
}

class Upload extends React.Component {
  constructor() {
    super()
    this.state = {
      isInitialized: false,
      isRecording: false,
      isProcessing: false,
      isListening: false,
      recordingTime: 30000
    }

    this.onVideoPlay = this.onVideoPlay.bind(this)
    this.fileUploaded = this.fileUploaded.bind(this)
    this.stopVideo = this.stopVideo.bind(this)
    this.startVideo = this.startVideo.bind(this)
  }

  async componentDidMount() {
    const MODELS = '/models'
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODELS),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS),
      faceapi.nets.faceExpressionNet.loadFromUri(MODELS),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS)
    ])
    console.log('completed loading')
  }

  startVideo() {
    let video = document.getElementById('upload__video')
    videostream = video
    video.play()
    this.setState({isListening: true})
  }

  stopVideo() {
    this.setState({isListening: false})
    let video = document.getElementById('upload__video')
    console.log('these are the emotions ---->', emotions)
    console.log('the time of the video', video.duration)
    running = false
    video.pause()
    audiostream.stop()

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
      transcript: 'Audio is unable to be transcribed for uploads!',
      duration: video.duration.toFixed(0) * 1000
    }
    audiostream.stop()
    this.props.setEmotion(emotionsPercentage)
    this.props.history.push('/results')
  }

  componentWillUnmount() {
    try {
      audiostream.stop()
      this.setState({isListening: false})
    } catch (e) {
      console.log('')
    }
  }

  fileUploaded(evt) {
    if (evt.target.files[0]) {
      console.log(evt.target.files[0])
      let videoFile = evt.target.files[0]
      let type = videoFile.type
      let video = document.getElementById('upload__video')
      let canPlay = video.canPlayType(type)
      if (canPlay === '') {
        console.log('Video format not supported.')
        return
      }
      let fileURL = URL.createObjectURL(videoFile)
      video.src = fileURL
    } else {
      console.log('Not uploaded')
    }
  }

  onVideoPlay() {
    console.log('fired off!')
    const {isListening} = this.state
    let self = this
    const dataTimer = 100
    running = true
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const mic = new SpeechRecognition()
    audiostream = mic

    mic.continuous = true
    mic.interimResults = true
    mic.lang = 'en-US'

    if (isListening) {
      mic.start()
    } else {
      mic.stop()
    }
    mic.onstart = () => {
      console.log('Mic Start')
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      outputResult = transcript
      mic.onerror = event => {
        console.log(event.error)
      }
    }
    mic.onend = () => {
      console.log('Mic Stop')
    }

    let interval = setInterval(async function() {
      if (running) {
        const input = document.getElementById('upload__video')
        const results = await faceapi
          .detectSingleFace(input)
          .withFaceLandmarks()
          .withFaceExpressions()
        if (results) {
          const emotionalResults = Object.keys(results.expressions).reduce(
            (a, b) => (results.expressions[a] > results.expressions[b] ? a : b)
          )
          emotions[emotionalResults]++
        }
      } else {
        clearInterval(interval)
      }
    }, dataTimer)
  }

  render() {
    return (
      <div className="upload">
        <div className="upload__container">
          <input
            id="input__upload"
            type="file"
            accept="video/*"
            onChange={this.fileUploaded}
          />
          <video
            src=""
            id="upload__video"
            height="500"
            width="500"
            onPlay={this.onVideoPlay}
            onEnded={this.stopVideo}
          />
          <div className="upload__input">
            <button type="button" onClick={this.startVideo}>
              Start
            </button>
            <button type="button" onClick={this.stopVideo}>
              Stop
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = () => {
  return {}
}

const mapDispatchToState = dispatch => {
  return {setEmotion: emotionObj => dispatch(setEmotionsInDb(emotionObj))}
}

export default connect(mapState, mapDispatchToState)(Upload)
