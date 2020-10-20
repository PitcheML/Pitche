import {Divider, Paper} from '@material-ui/core'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import SimplePieChart from './SimplePieChart'

class HistoryCard extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
  }

  getData() {
    const {emotion} = this.props
    const data = [
      {name: 'Angry', value: emotion.angry},
      {name: 'Disgusted', value: emotion.disgusted},
      {name: 'Fearful', value: emotion.fearful},
      {name: 'Happy', value: emotion.happy},
      {name: 'Neutral', value: emotion.neutral},
      {name: 'Sad', value: emotion.sad},
      {name: 'Surprised', value: emotion.surprised}
    ]
    return data
  }

  render() {
    const {emotion} = this.props
    const {createdAt} = emotion
    let date = createdAt.slice(0, createdAt.indexOf('T'))
    const [year, month, day] = date.split('-')
    console.log(emotion)
    return (
      <Link to={`/history/${emotion.id}`}>
        <Paper elevation={4}>
          <div className="history__card" key={emotion.id}>
            <h1>Speech #{emotion.id}</h1>
            <h2>{`${month}/${day}/${year}`}</h2>
            <h2>
              Length:{' '}
              {emotion.duration / 1000 > 60
                ? (emotion.duration / 1000 / 60).toFixed(2)
                : (emotion.duration / 1000).toFixed(0)}
              <span>
                {emotion.duration / 1000 > 60 ? ' minutes' : ' seconds'}
              </span>
            </h2>
            {emotion.transcript ? (
              <h2>Word Count: {emotion.transcript.split(' ').length}</h2>
            ) : (
              <h2>No Transcript</h2>
            )}
            <SimplePieChart data={this.getData()} />
          </div>
        </Paper>
      </Link>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryCard)
