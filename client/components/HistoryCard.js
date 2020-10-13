import {Divider} from '@material-ui/core'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import SimplePiceChart from './SimplePieChart'
import {Link} from 'react-router-dom'

class HistoryCard extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
  }

  getData() {
    const {emotion} = this.props
    console.log('emotion', emotion)

    const data = [
      {name: 'Angry', value: emotion.angry},
      {
        name: 'Disgusted',
        value: emotion.disgusted
      },
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

    return (
      <div className="history__card" key={emotion.id}>
        <h1>{`${month}/${day}/${year}`}</h1>
        <Link to={`/history/${emotion.id}`}>
          <SimplePiceChart data={this.getData()} />
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryCard)
