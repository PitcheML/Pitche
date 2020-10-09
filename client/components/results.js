import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie} from 'billboard.js'

class Results extends Component {
  constructor(props) {
    super(props)
    this.createCharts = this.createCharts.bind(this)
  }

  componentDidMount() {
    this.createCharts()
  }

  componentDidUpdate() {
    this.createCharts()
  }

  createCharts() {
    const emotions = this.props.emotion
    const recentResult = emotions[emotions.length - 1]
    bb.generate({
      data: {
        columns: [
          ['Angry', recentResult.angry],
          ['Disgusted', recentResult.disgusted],
          ['Fearful', recentResult.fearful],
          ['Happy', recentResult.happy],
          ['Neutral', recentResult.neutral],
          ['Sad', recentResult.sad],
          ['Surprised', recentResult.surprised]
        ],
        type: pie(),
        labels: true,
        colors: {
          Angry: '#060760',
          Disgusted: '#090C9B',
          Fearful: '#3D52D5',
          Happy: '#6878DE',
          Neutral: '#B4C5E4',
          Sad: '#D2DCEF',
          Surprised: '#FBFFF1'
        }
      },
      size: {
        height: 500
      },
      padding: {
        left: 250,
        right: 250
      },
      bindto: '#pieChart'
    })
    bb.generate({
      data: {
        columns: [
          ['Angry', (recentResult.angry * 100).toFixed(2)],
          ['Disgusted', (recentResult.disgusted * 100).toFixed(2)],
          ['Fearful', (recentResult.fearful * 100).toFixed(2)],
          ['Happy', (recentResult.happy * 100).toFixed(2)],
          ['Neutral', (recentResult.neutral * 100).toFixed(2)],
          ['Sad', (recentResult.sad * 100).toFixed(2)],
          ['Surprised', (recentResult.surprised * 100).toFixed(2)]
        ],
        type: bar(),
        labels: true,
        colors: {
          Angry: '#060760',
          Disgusted: '#090C9B',
          Fearful: '#3D52D5',
          Happy: '#6878DE',
          Neutral: '#B4C5E4',
          Sad: '#D2DCEF',
          Surprised: '#FBFFF1'
        }
      },
      size: {
        height: 500
      },
      padding: {
        left: 250,
        right: 250
      },
      bindto: '#barChart'
    })
  }

  render() {
    return (
      <div>
        <h2>Your Pitch Video Results:</h2>
        <div className-="results-charts">
          <div id="pieChart" className="charts" />
          <div id="barChart" className="charts" />
        </div>

      </div>
    )
  }
}

const mapState = state => {
  return {
    emotion: state.emotion
  }
}

export default connect(mapState)(Results)
