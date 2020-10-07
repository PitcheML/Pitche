import React, {useEffect, useRef, useState} from 'react'
import * as faceapi from 'face-api.js'
import Countdown from 'react-countdown'
import {Redirect} from 'react-router-dom'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

let videostream

function Video() {
  const VIDEO_HEIGHT = 480
  const VIDEO_WIDTH = 640

  const [isInitialized, setInitialized] = useState(false)
  const videoRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    const loadModels = async () => {
      const MODELS = '/models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODELS),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODELS),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODELS),
        faceapi.nets.faceExpressionNet.loadFromUri(MODELS),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS)
      ])
    }
    loadModels()
  }, [])

  const handlePlayback = () => {
    if (!isInitialized) {
      startVideo()
      setInitialized(true)
    } else {
      stopVideo()
      setInitialized(false)
    }
  }

  const startVideo = () => {
    navigator.getUserMedia(
      {
        video: true
      },
      stream => {
        videoRef.current.srcObject = stream
        videostream = stream
      },
      err => console.error(err)
    )
    console.log(videostream)
    setInterval(async function() {
      if (videostream) {
        if (videostream.active === true) {
          const input = document.getElementById('live-video')
          const results = await faceapi
            .detectSingleFace(input)
            .withFaceLandmarks()
            .withFaceExpressions()
          console.log(results)
        }
      }
    }, 500)
  }

  const stopVideo = () => {
    setInitialized(false)
    videostream.getTracks()[0].stop()
  }

  const Completion = () => {
    stopVideo()
    return (
      <button type="submit" onSubmit={handlePlayback}>
        See Results
      </button>
    )
  }

  return (
    <div className="video">
      <div className={isInitialized ? 'video__left' : 'video__left__hidden'}>
        {isInitialized ? (
          <Countdown date={Date.now() + 9000} daysInHours={true}>
            <Completion />
          </Countdown>
        ) : null}
      </div>
      <div className={isInitialized ? 'video__right' : 'video__right__hidden'}>
        {isInitialized ? (
          <h4>
            REC <button className="rec" />
          </h4>
        ) : null}
        <div
          className={
            isInitialized ? 'video__container' : 'video__container__hidden'
          }
        >
          <video id="live-video" ref={videoRef} autoPlay muted />
        </div>
      </div>

      <button type="button" className="video__button" onClick={handlePlayback}>
        {isInitialized ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}

export default Video
