import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Avatar} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import AssessmentIcon from '@material-ui/icons/Assessment'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import CreateIcon from '@material-ui/icons/Create'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="navbar">
    <nav>
      {isLoggedIn ? (
        <div className="navbar__container">
          {/* The navbar will show these links after you log in */}

          <div className="navbar__left">
            <div className="navbar__links">
              <Link to="/home">
                Home <HomeIcon />
              </Link>
            </div>
            <div className="navbar__links">
              <Link to="/video">
                Record New Pitch <RecordVoiceOverIcon />
              </Link>
            </div>
            <div className="navbar__links">
              <Link to="/results">
                Last Pitch Analysis <AssessmentIcon />
              </Link>
            </div>
              <div className="navbar__links">
              <Link to="/history">
                Pitch History <AssessmentIcon />
              </Link>
            </div>
          </div>
          <div className="navbar__right">
            <div className="navbar__right__acc">
              <Avatar />
              <Link to="/account">My Account</Link>
            </div>
            <div className="navbar__links__right">
              <a href="#" onClick={handleClick}>
                Logout
              </a>
              <ExitToAppIcon />
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar__left">
          {/* The navbar will show these links before you log in */}
          <div className="navbar__links">
            <Link to="/login">
              Login
              <MeetingRoomIcon />
            </Link>
          </div>

          <div className="navbar__links">
            <Link to="/signup">
              Sign Up
              <CreateIcon />
            </Link>
          </div>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
