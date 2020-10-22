import React from 'react'
import * as faceapi from 'face-api.js'

let videostream
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
  }

  stopVideo() {
    let video = document.getElementById('upload__video')
    console.log('these are the emotions ---->', emotions)
    running = false
    video.pause()
  }

  onVideoPlay() {
    console.log('fired off!')
    let self = this
    let count = 0
    const dataTimer = 100
    running = true
    let interval = setInterval(async function() {
      if (running) {
        const input = document.getElementById('upload__video')
        const results = await faceapi
          .detectSingleFace(input)
          .withFaceLandmarks()
          .withFaceExpressions()
        // count++
        // if (count === 5) {
        //   self.setState({isRecording: true})
        // }
        // if (self.state.isRecording) {
        //   if (results) {
        //     const emotionalResults = Object.keys(
        //       results.expressions
        //     ).reduce((a, b) =>
        //       results.expressions[a] > results.expressions[b] ? a : b
        //     )
        //     emotions[emotionalResults]++
        //   }
        // }
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
          <video
            src="bbt.mp4"
            id="upload__video"
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

export default Upload
