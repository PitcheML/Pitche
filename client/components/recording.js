import React, {Component} from 'react'
import {connect} from 'react-redux'
import Countdown from 'react-countdown'

class Recording extends Component {
  constructor() {
    super()
    this.state = {
      recording: false
    }
    this.startRecord = this.startRecord.bind(this)
  }

  startRecord() {
    if (!this.state.recording) {
      console.log('Recording started')
      this.startVideo()
    } else {
      this.stopVideo()
      console.log('Recording ended')
    }
    let currentRecordState = this.state.recording
    this.setState({recording: !currentRecordState})
  }

  startVideo() {
    console.log('access')
    navigator.getUserMedia(
      {
        video: true
      },
      stream => (video.srcObject = stream),
      err => console.error(err)
    )
  }

  stopVideo() {
    console.log('trying to stop')
    navigator.getUserMedia(
      {
        video: true
      },
      stream => {
        console.log('we are inside', stream.getVideoTracks())
        let track = stream.getVideoTracks()[0]
        track.stop()
        console.log('this the track, ', track)
      },
      err => console.error(err)
    )
  }

  render() {
    console.log('THIS IS THIS --->', this)
    const Completionist = () => <span>Show Results</span>
    return (
      <React.Fragment>
        <div>
          <h3>Recording Component</h3>
        </div>

        <div>
          {this.state.recording ? (
            <div>
              <video id="video" width="500px" height="400px" autoPlay muted />
              <h3>
                Time Remaining:
                <Countdown date={Date.now() + 90000}>
                  <Completionist />
                </Countdown>{' '}
              </h3>
            </div>
          ) : null}
        </div>
        <div>
          <button type="submit" onClick={this.startRecord}>
            {' '}
            Record Pitch{' '}
          </button>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

export default connect(mapState)(Recording)
