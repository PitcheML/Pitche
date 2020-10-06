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
    } else {
      console.log('Recording ended')
    }
    let currentRecordState = this.state.recording
    this.setState({recording: !currentRecordState})
  }
  render() {
    const Completionist = () => <span>Show Results</span>
    return (
      <React.Fragment>
        <div>
          <h3>Recording Component</h3>
        </div>
        <div>
          {this.state.recording ? (
            <h3>
              Time Remaining:
              <Countdown date={Date.now() + 90000}>
                <Completionist />
              </Countdown>{' '}
            </h3>
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
