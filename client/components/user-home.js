import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Avatar, Button} from '@material-ui/core'
import HistoryCard from './HistoryCard'
import {fetchEmotions} from '../store/emotion'
import Tutorial from './Tutorial'
import Modal from '@material-ui/core/Modal'


/**
 * COMPONENT
 */
export const UserHome = props => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div className="userHome__tutorial">
      <Tutorial handleClose={handleClose} />
    </div>
  )

  const {email, user, emotion} = props

  useEffect(() => {
    props.getEmotions()

    handleOpen()
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
            <h4>Welcome back, {user.email}!</h4>
            <Avatar src={user.imgUrl} />
          </div>
        </div>
        <div
          className={
            emotion.length > 0 ? 'userHome__bottom__active' : 'userHome__bottom'
          }
        >
          {emotion.length > 0 ? (
            emotion.map(emo => <HistoryCard key={emo.id} emotion={emo} />)
          ) : (
            <>
              <h4>You don't have any record pitches... let's change that!</h4>
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
    getEmotions: () => dispatch(fetchEmotions())
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
