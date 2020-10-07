import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_EMOTIONS = 'GET_EMOTIONS'

/**
 * INITIAL STATE
 */
const emotions = []

/**
 * ACTION CREATORS
 */
const getEmotions = emotion => ({type: GET_EMOTIONS, emotion})

/**
 * THUNK CREATORS
 */

export const setEmotions = emotionObj => async dispatch => {
  try {
    console.log('inside emotion thunk')
    dispatch(getEmotions(emotionObj))
    // history.push('/results')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = emotions, action) {
  switch (action.type) {
    case GET_EMOTIONS:
      return [...state, action.emotion]

    default:
      return state
  }
}
