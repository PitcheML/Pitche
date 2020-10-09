import {Divider} from '@material-ui/core'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie} from 'billboard.js'

class HistoryCard extends Component {
  constructor(props) {
    super(props)
    this.createCharts = this.createCharts.bind(this)
    this.count = 0
  }

  componentDidMount() {
    console.log('firing off')
    this.createCharts()
  }

  createCharts() {
    const {emotion} = this.props
    console.log('these are the emotions--->', emotion)

    bb
      .generate({
        data: {
          columns: [
            ['Angry', emotion.angry],
            ['Disgusted', emotion.disgusted],
            ['Fearful', emotion.fearful],
            ['Happy', emotion.happy],
            ['Neutral', emotion.neutral],
            ['Sad', emotion.sad],
            ['Surprised', emotion.surprised]
          ],
          type: pie(),
          labels: false,

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
          height: 300
        },
        padding: {
          left: 250,
          right: 250
        },

        bindto: `#pieChart${emotion.id}`
      })
      .legend.hide()
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
        <div id={`pieChart${emotion.id}`} className="charts" />
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryCard)
