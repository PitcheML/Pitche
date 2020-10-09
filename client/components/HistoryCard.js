import {Divider} from '@material-ui/core'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie} from 'billboard.js'

class HistoryCard extends Component {
  constructor() {
    super()
    this.createCharts = this.createCharts.bind(this)
  }

  componentDidMount() {
    this.createCharts()
  }

  componentDidUpdate() {
    this.createCharts()
  }

  render() {
    const {emotion} = this.props
    const {createdAt} = emotion

    let date = createdAt.slice(0, createdAt.indexOf('T'))
    const [year, month, day] = date.split('-')

    // console.log('these are the historyCard props, ===> ', this.props)
    return (
      <div className="history__card" key={emotion.id}>
        <h1>{`${month}/${day}/${year}`}</h1>
        <img
          src="https://lh3.googleusercontent.com/g0Jw-I6-gH2DVCpnl3u8QKZVT_meR9lcJlpyeSZ-MyvwLnyEZvgyrY5frldA8HCv55s=w280-rwa"
          alt="pie chart"
        />
        {/* <div>
          <h2>Sad: {(emotion.sad * 100).toFixed(2)}%</h2>
          <h2>Angry: {(emotion.angry * 100).toFixed(2)}%</h2>
          <h2>Neutral: {(emotion.neutral * 100).toFixed(2)}%</h2>
          <h2>Surprised: {(emotion.surprised * 100).toFixed(2)}%</h2>
          <h2>Happy: {(emotion.happy * 100).toFixed(2)}%</h2>
          <h2>Disgusted: {(emotion.disgusted * 100).toFixed(2)}%</h2>
          <h2>Fearful: {(emotion.fearful * 100).toFixed(2)}%</h2>
        </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryCard)
