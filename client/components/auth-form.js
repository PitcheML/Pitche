import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import GoogleButton from 'react-google-button'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props
  return (
    <div className="auth__container">
      <Paper elevation={3}>
        <div className="auth">
          <div className="auth__logo">
            <img src="logo.png" alt="" />
          </div>

          <form onSubmit={handleSubmit} name={name}>
            <div>
              <label htmlFor="email">
                <small>Email</small>
              </label>
              <input name="email" type="text" />
            </div>
            <div>
              <label htmlFor="password">
                <small>Password</small>
              </label>
              <input name="password" type="password" />
            </div>
            <div>
              <button type="submit">{displayName}</button>
            </div>
            <div>
              <a
                style={{
                  width: '100%',
                  margin: 'auto',
                  height: '2.5rem',
                  borderRadius: '4px',
                  paddingLeft: '2px',
                  paddingTop: '1px',
                  paddingBottom: '1px'
                }}
                href="/auth/google"
              >
                <GoogleButton
                  type="light"
                  style={{
                    width: '100%',
                    margin: 'auto',
                    height: '2.5rem',
                    borderRadius: '4px',
                    paddingLeft: '2px',
                    paddingTop: '1px',
                    paddingBottom: '1px'
                  }}
                />
              </a>
            </div>
            <div>
              {error &&
                error.response && (
                  <div className="auth__error"> {error.response.data} </div>
                )}
            </div>
          </form>
        </div>
      </Paper>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
