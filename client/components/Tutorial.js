import React from 'react'
import {connect} from 'react-redux'
import VideoCallIcon from '@material-ui/icons/VideoCall'
import {Button} from '@material-ui/core'

const Tutorial = props => {
  const {email, handleClose} = props
  return (
    <div className="tutorial">
      <div className="main-tutorial">
        <h2 className="user-title">Hello {email}!</h2>
        <div className="user-title__welcome">
          <h3 className="intro">
            Welcome to Pitche - we are glad you are here.
          </h3>
          <h3>
            Please see the panel on the right for instructions on how to record
            a pitch or click the nav bar above to view pitches that you have
            previously recorded.
          </h3>
        </div>
      </div>
      <div className="pitch-instruction">
        <div className="pitch-instructions__top">
          <h4>How to Record Your Pitch</h4>
          <ol className="procedure">
            <li>
              Click "Record New Pitch" on the next page, you will then be taken
              to your pitch recording booth.
            </li>
            <li>
              Once there - you will be prompted to enable video and audio
              recording permissions for our application.
            </li>
            <li>
              Once you have enabled permissions, you will see the{' '}
              <VideoCallIcon /> icon appear and the "Start Processing" button
              will turn red.
            </li>
            <li>Click this to begin recording your speech!</li>
            <li>
              Once you have finished recording you will be taken to your results
              page for your pitch.
            </li>
          </ol>
        </div>
        <div className="pitch-instructions__bottom">
          <p>Enjoy and please let us know any feedback or bugs!</p>
          <div className="bottom__button">
            <Button variant="contained" color="primary" onClick={handleClose}>
              Got It
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(Tutorial)
