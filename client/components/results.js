import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie} from 'billboard.js'
import {fetchEmotions} from '../store/emotion'
import TwoLevelPieChart from './TwoLevelPieChart'

class Results extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
  }
  async componentDidMount() {
    await this.props.getEmotions()
  }

  getData() {
    const emotions = this.props.emotion
    const recentResult = emotions[emotions.length - 1]

    const data = [
      {name: 'Angry', value: recentResult.angry},
      {
        name: 'Disgusted',
        value: recentResult.disgusted
      },
      {name: 'Fearful', value: recentResult.fearful},
      {name: 'Happy', value: recentResult.happy},
      {name: 'Neutral', value: recentResult.neutral},
      {name: 'Sad', value: recentResult.sad},
      {name: 'Surprised', value: recentResult.surprised}
    ]

    return data
  }

  render() {
    console.log('these are the props ----> ', this)
    return (
      <div>
        {this.props.emotion.length > 0 ? (
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
    emotion: state.emotion
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getEmotions: () => dispatch(fetchEmotions())
  }
}

export default connect(mapState, mapDispatchToProps)(Results)
