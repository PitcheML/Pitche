import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie, donut, radar} from 'billboard.js'
import {fetchEmotions} from '../store/emotion'
import Paper from '@material-ui/core/Paper'

class Results extends Component {
  constructor() {
    super()
    this.createCharts = this.createCharts.bind(this)
  }
  async componentDidMount() {
    await this.props.getEmotions()
    this.createCharts()
  }

  createCharts() {
    console.log('these are the emotions--->', this)
    const emotions = this.props.emotion
    const recentResult = emotions[emotions.length - 1]
    console.log('these are the recent results ---->', recentResult)
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
        label: {
          show: true
        },
        labels: {
          colors: 'black'
        },
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
        height: 250
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
        height: 350
      },
      bindto: '#barChart'
    })
  }

  render() {
    console.log('these are the props ----> ', this)
    return (
      <div className="results">
        {this.props.emotion.length > 0 ? (
          <React.Fragment>
            <Paper elevation={5}>
              <h2>Your Most Recent Analysis:</h2>
              <div className="results__charts">
                <div className="results__charts__left">
                  <Paper elevation={4}>
                    <div className="results__chart__inner">
                      <div id="pieChart" className="charts" />
                    </div>
                  </Paper>
                  <Paper elevation={4}>
                    <div className="results__chart__inner">
                      <div id="barChart" className="charts" />
                    </div>
                  </Paper>
                </div>
                {/* <div className="results__charts__right">
                  <Paper elevation={4}>
                    <h4>I am results</h4>
                  </Paper>
                </div> */}
              </div>
            </Paper>
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
