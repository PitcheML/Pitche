import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_EMOTIONS = 'GET_EMOTIONS'
const SET_EMOTIONS = 'SET_EMOTIONS'
const DELETE_EMOTION = 'DELETE_EMOTION'

/**
 * INITIAL STATE
 */
const emotions = []

/**
 * ACTION CREATORS
 */
const getEmotions = emotion => ({type: GET_EMOTIONS, emotion})
const setEmotions = emotion => ({type: SET_EMOTIONS, emotion})
const deleteEmotion = emotionId => ({type: DELETE_EMOTION, emotionId})

/**
 * THUNK CREATORS
 */
export const fetchEmotions = () => async dispatch => {
  try {
    const {data: emotionsFromDb} = await axios.get('/api/history')
    dispatch(getEmotions(emotionsFromDb))
  } catch (error) {
    console.error(error)
  }
}

export const setEmotionsInDb = emotionObj => async dispatch => {
  try {
    const {data: emotion} = await axios.post('/api/history', emotionObj)
    console.log('inside emotion thunk')
    dispatch(setEmotions(emotion))
  } catch (err) {
    console.error(err)
  }
}

export const deleteEmotionFromDB = emotionId => async dispatch => {
  try {
    await axios.delete(`/api/history/${emotionId}`)

    dispatch(deleteEmotion(emotionId))
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
      return action.emotion
    case SET_EMOTIONS:
      return [...state, action.emotion]
    case DELETE_EMOTION:
      return [...state].filter(emotion => action.emotionId !== emotion.id)
    default:
      return state
  }
}
