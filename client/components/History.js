import {Button} from '@material-ui/core'
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
            <div
              className={
                emotions.length > 0
                  ? 'userHome__bottom__active'
                  : 'userHome__bottom'
              }
            >
              {emotions.length > 0 ? (
                emotions.map(emo => (
                  <>
                    <HistoryCard key={emo.id} emotion={emo} />
                  </>
                ))
              ) : (
                <>
                  <div className="history__wrapper">
                    <div className="history__none">
                      <h4>
                        You don't have any recorded pitches... let's change
                        that!
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
                  </div>
                </>
              )}
            </div>
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
