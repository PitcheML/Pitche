import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Avatar, Button} from '@material-ui/core'
import HistoryCard from './HistoryCard'
import {fetchEmotions} from '../store/emotion'
import Tutorial from './Tutorial'
import Modal from '@material-ui/core/Modal'
import {finishTutorial} from '../store/user'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const [open, setOpen] = useState(false)
  const {email, user, emotion} = props

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    props.finishTutorial(user.id)
  }

  const body = (
    <div className="userHome__tutorial">
      <Tutorial handleClose={handleClose} />
    </div>
  )

  useEffect(() => {
    props.getEmotions()
    if (user.tutorialCompleted === false) {
      setOpen(true)
    }
  }, [])

  return (
    <div className="userHome">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <div className="userHome__container">
        <div className="userHome__top">
          <div className="userHome__top__left">
            <Avatar src={user.imgUrl} />
            <h4>Welcome back, {user.email}!</h4>
          </div>
        </div>
        <div
          className={
            emotion.length > 0 ? 'userHome__bottom__active' : 'userHome__bottom'
          }
        >
          {emotion.length > 0 ? (
            emotion.map(emo => (
              <>
                <HistoryCard key={emo.id} emotion={emo} />
              </>
            ))
          ) : (
            <>
              <h4>You don't have any recorded pitches... let's change that!</h4>
              <h3>⬇</h3>
              <Button
                variant="contained"
                color="primary"
                onClick={() => props.history.push('/video')}
              >
                Record A New Pitch
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    user: state.user,
    emotion: state.emotion
  }
}

const mapDispatch = dispatch => {
  return {
    getEmotions: () => dispatch(fetchEmotions()),
    finishTutorial: userId => dispatch(finishTutorial(userId))
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
