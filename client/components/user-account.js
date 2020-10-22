import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateUser, updateUserImage} from '../store/user'
import {fetchEmotions} from '../store/emotion'
import {Avatar, Button} from '@material-ui/core'
import HistoryCard from './HistoryCard'
import {app} from '../../firebase'

let file
let e_upload

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
    this.handleUpload = this.handleUpload.bind(this)
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

  async handleUpload(e) {
    e.preventDefault()
    const storageRef = app.storage().ref()
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    const fileUrl = await fileRef.getDownloadURL()
    const fileUploader = document.getElementsByClassName('file__uploader')[0]
    fileUploader.reset()

    this.props.updateUserImage(this.props.user.id, fileUrl)
  }

  onFileChange(e) {
    file = e.target.files[0]
  }

  render() {
    const {user, emotion} = this.props
    return (
      <div className="userAccount">
        <div className="userAccount__container">
          <div className="userAccount__container__top">
            <div className="userAccount__left">
              <Avatar src={user.imgUrl} />
              <h1>{user.email}</h1>
              <h1>Total Recorded Pitches: {emotion.length}</h1>
            </div>
            <div className="userAccount__middle">
              <div className="middle__top">
                <form onSubmit={this.handleUpload} className="file__uploader">
                  <input type="file" onChange={this.onFileChange} />
                  <div />
                  <button type="submit">Upload</button>
                </form>
                <form
                  onSubmit={this.changeEmail}
                  className="userAccount__email"
                >
                  <div>
                    <div className="email__top">
                      <label htmlFor="email">
                        <small>Change Email</small>
                      </label>
                      <input
                        onChange={this.onChange}
                        name="email"
                        type="text"
                        value={this.state.email}
                      />
                    </div>
                    <div className="email__button">
                      <button type="submit">Update Email</button>
                    </div>
                  </div>
                </form>
                <form
                  onSubmit={this.changePassword}
                  className="userAccount__pw"
                >
                  <div>
                    <div className="pw__top">
                      <label htmlFor="password">
                        <small>Change Password</small>
                      </label>
                      <input
                        onChange={this.onChange}
                        name="password"
                        type="password"
                        value={this.state.password}
                      />
                    </div>
                    <div className="pw__button">
                      <button type="submit">Update Password</button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="middle__bottom">
                {this.state.invalidInputs ? (
                  <h3>You need to add inputs to update user information</h3>
                ) : null}
              </div>
            </div>
            <div className="userAccount__right" />
          </div>
          <div className="userAccount__container__bottom">
            {emotion.length > 0 ? (
              emotion.map(invEmo => {
                return (
                  <>
                    <HistoryCard key={invEmo.id} emotion={invEmo} />
                  </>
                )
              })
            ) : (
              <div className="userAccount__noResults">
                <h4>
                  You don't have any recorded pitches... let's change that!
                </h4>
                <h3>⬇</h3>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.props.history.push('/video')}
                >
                  Record A New Pitch
                </Button>
              </div>
            )}
          </div>
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
    getEmotions: () => dispatch(fetchEmotions()),
    updateUserImage: (id, imageUrl) => dispatch(updateUserImage(id, imageUrl))
  }
}

export default connect(mapState, mapDispatch)(UserAccount)
