import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateUser} from '../store/user'
import {fetchEmotions} from '../store/emotion'
import {Avatar} from '@material-ui/core'

class UserAccount extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      invalidInputs: false
    }
    this.onChange = this.onChange.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }

  componentDidMount() {
    this.props.getEmotions()
  }

  changeEmail(evt) {
    evt.preventDefault()
    if (this.state.email) {
      this.props.updateUser(this.props.user.id, 'email', this.state.email)
      this.setState({email: ''})
    } else {
      this.setState({invalidInputs: true})
    }
  }

  changePassword(evt) {
    evt.preventDefault()
    if (this.state.password) {
      this.props.updateUser(this.props.user.id, 'password', this.state.password)
      this.setState({password: ''})
    } else {
      this.setState({invalidInputs: true})
    }
  }

  onChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  render() {
    const {user, emotion} = this.props
    return (
      <div>
        <div>
          <Avatar />
          <h1>User Email:</h1>
          <h1>{user.email}</h1>
        </div>
        <div>
          <h2>Total Recorded Pitches: {emotion.length}</h2>
        </div>
        <div>
          <form onSubmit={this.changeEmail}>
            <div>
              <label htmlFor="email">
                <small>Change Email</small>
              </label>
              <input
                onChange={this.onChange}
                name="email"
                type="text"
                value={this.state.email}
              />
              <button type="submit">Click to Update Email</button>
            </div>
          </form>
        </div>
        <div>
          <form onSubmit={this.changePassword}>
            <div>
              <label htmlFor="password">
                <small>Change Password</small>
              </label>
              <input
                onChange={this.onChange}
                name="password"
                type="password"
                value={this.state.password}
              />
              <button type="submit">Click to Update Password</button>
            </div>
          </form>
          {this.state.invalidInputs ? (
            <h3>You need to add inputs to update user information</h3>
          ) : (
            <div />
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    emotion: state.emotion
  }
}

const mapDispatch = dispatch => {
  return {
    updateUser: (id, field, value) => dispatch(updateUser(id, field, value)),
    getEmotions: () => dispatch(fetchEmotions())
  }
}

export default connect(mapState, mapDispatch)(UserAccount)
