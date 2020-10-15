import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchEmotions} from '../store/emotion'
import HistoryCard from './HistoryCard'

class History extends Component {
  componentDidMount() {
    this.props.getEmotions()
  }
  render() {
    const emotions = this.props.emotion

    return (
      <div className="history">
        <div className="history__container">
          {emotions.length > 0 ? (
            emotions.map(emotion => {
              return <HistoryCard key={emotion.id} emotion={emotion} />
            })
          ) : (
            <h4>None</h4>
          )}
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

const mapDispatchToState = dispatch => {
  return {getEmotions: () => dispatch(fetchEmotions())}
}

export default connect(mapState, mapDispatchToState)(History)
