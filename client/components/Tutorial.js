import React from 'react'
import {connect} from 'react-redux'
import VideoCallIcon from '@material-ui/icons/VideoCall'

const Tutorial = props => {
  const {email} = props
  return (
    <div className="tutorial">
      <div className="main-tutorial">
        <h2 className="user-title">Hello {email}!</h2>
        <h3 className="intro">Welcome to Pitche - we are glad you are here.</h3>
        <h3>
          Please see the panel on the right for instructions on how to record a
          pitch or click the nav bar above to view pitches that you have
          previously recorded.
        </h3>
      </div>
      <div className="pitch-instruction">
        <ol className="procedure">
          <li>
            When you click "Record New Pitch" above you will be taken to your
            pitch recording booth.
          </li>
          <li>
            Once you are on this page - you must enable video and audio
            recording permissions for our application.
          </li>
          <li>
            Once you have enabled permissions, you will see the{' '}
            <VideoCallIcon /> icon appear and the "Start Processing" button will
            turn red.
          </li>
          <li>Click this to begin recording your speech!</li>
          <li>
            Once you have finished recording you will be taken to your results
            page for your pitch.
          </li>
        </ol>
        <p>Enjoy and please let us know any feedback or bugs!</p>
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
