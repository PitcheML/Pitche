import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Recording from './recording'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h3>
        Welcome, click above to see your previous pitches or record a new one
      </h3>
      <Recording />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
