import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPitch} from '../store/singlePitch'
import Paper from '@material-ui/core/Paper'
import TwoLevelPieChart from './TwoLevelPieChart'

class SinglePitch extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
  }
  async componentDidMount() {
    await this.props.getPitch(this.props.match.params.pitchId)
  }

  getData() {
    const {pitch} = this.props

    const data = [
      {name: 'Angry', value: pitch.angry},
      {name: 'Disgusted', value: pitch.disgusted},
      {name: 'Fearful', value: pitch.fearful},
      {name: 'Happy', value: pitch.happy},
      {name: 'Neutral', value: pitch.neutral},
      {name: 'Sad', value: pitch.sad},
      {name: 'Surprised', value: pitch.surprised}
    ]

    return data
  }

  render() {
    return (
      <div className="results">
        {this.props.pitch.id ? (
          <React.Fragment>
            <h2>Your Pitch Video Results:</h2>
            <TwoLevelPieChart data={this.getData()} />
          </React.Fragment>
        ) : (
          <h4>none</h4>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    pitch: state.singlePitch
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPitch: pitchId => dispatch(fetchPitch(pitchId))
  }
}

export default connect(mapState, mapDispatchToProps)(SinglePitch)
